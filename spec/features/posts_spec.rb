require "rails_helper"
require "shared_context/cloudinary_stub"

RSpec.describe "DELETE /posts", type: :request do
  context "when user is unauthenticated" do
    let(:post) { create(:post) }
    before { delete "/posts/#{post.id}" }

    it "returns 400" do
      expect(response.status).to eq 400
    end

    it "does not delete the post" do
      expect(Post.find(post.id)).to eq post
    end
  end

  context "when user owns the post" do
    let(:user) { create(:user) }
    let(:post) { create(:post, user: user) }

    before(:each) do
      sign_in user
    end

    before { delete "/posts/#{post.id}" }

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "deletes the post" do
      expect(Post.find_by(id: post.id)).to eq nil
    end
  end

  context "when the user admins the artist page where the post lives" do
    let(:user) { create(:user) }
    let(:artist_page) { create(:artist_page) }
    let(:post) { create(:post, artist_page: artist_page) }

    before do
      user.owned_pages << artist_page
      PageOwnership.find_by(user_id: user[:id], artist_page_id: artist_page[:id]).update(role: "admin")
    end

    before(:each) do
      sign_in user
    end

    before { delete "/posts/#{post.id}" }

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "deletes the post" do
      expect(Post.find_by(id: post.id)).to eq nil
    end
  end

  context "when attempting to delete another users' post" do
    let(:user) { create(:user) }
    let(:post) { create(:post) }

    before(:each) do
      sign_in user
    end

    before { delete "/posts/#{post.id}" }

    it "returns 400" do
      expect(response.status).to eq 400
    end

    it "does not delete the post" do
      expect(Post.find(post.id)).to eq post
    end
  end

  context "when post has audio" do
    let(:user) { create(:user) }
    let(:post) { create(:post, user: user) }
    let(:s3_bucket) { double }
    let(:s3_object) { double }

    before(:each) do
      sign_in user

      audio_processing_service = double
      allow(AudioProcessingService).to receive(:new) { audio_processing_service }
      allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
      allow(audio_processing_service).to receive(:duration) { 123 }
      allow(audio_processing_service).to receive(:generate_waveform) { [1] }
      allow(audio_processing_service).to receive(:dispose)

      post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
      post.save!

      s3 = double
      allow(Aws::S3::Resource).to receive(:new) { s3 }
      allow(s3).to receive(:bucket) { s3_bucket }
      allow(s3_bucket).to receive(:object) { s3_object }
      allow(s3_object).to receive(:delete)

      delete "/posts/#{post.id}"
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "deletes the audio upload record too" do
      audio_upload = AudioUpload.where(post_id: post.id).first
      expect(audio_upload).to eq nil
    end

    it "deletes the audio object from S3" do
      expect(s3_bucket).to have_received(:object).with("abc.mp3")
      expect(s3_object).to have_received(:delete)
    end
  end
end

RSpec.describe "PUT /posts", type: :request do
  include_context "cloudinary_stub"

  context "when user is unauthenticated" do
    let(:post) { create(:post, title: "old title") }
    before { put "/posts/#{post.id}", params: { post: { title: "new title" } } }

    it "returns 400" do
      expect(response.status).to eq 400
    end

    it "does not update the post" do
      expect(Post.find(post.id).title).to eq "old title"
    end
  end

  context "when user owns the post" do
    let(:user) { create(:user) }
    let!(:image) { create(:image) }
    let!(:post) { create(:post, user: user, title: "my old title", images: [image]) }

    before(:each) do
      sign_in user
    end

    it "returns 200" do
      put "/posts/#{post.id}", params: { post: { title: "my new title" } }
      expect(response.status).to eq 200
    end

    it "updates the post" do
      put "/posts/#{post.id}", params: { post: { title: "my new title" } }
      expect(Post.find_by(id: post.id).title).to eq "my new title"
    end

    it "adds images to the post" do
      expect {
        put "/posts/#{post.id}", params: { post: { images: [{ url: "http://image1.com", public_id: "public_id" }] } }
      }.to change(Image, :count).by(1)
      post.reload
      expect(post.images.size).to eq(2)
      expect(post.images.last.url).to eq("http://image1.com")
      expect(post.images.last.public_id).to eq("public_id")
    end

    it "deletes images from the post" do
      expect {
        put "/posts/#{post.id}", params: { post: { images: [{ id: image.id, _destroy: true }] } }
      }.to change(Image, :count).by(-1)
    end
  end

  context "when a post's audio upload is set to be destroyed", vcr: true do
    let(:user) { create(:user) }
    let(:post) { create(:post, user: user) }
    let(:s3_bucket) { double }
    let(:s3_object) { double }

    before(:each) do
      sign_in user

      s3 = double
      allow(Aws::S3::Resource).to receive(:new) { s3 }
      allow(s3).to receive(:bucket) { s3_bucket }
      allow(s3_bucket).to receive(:object) { s3_object }
      allow(s3_object).to receive(:delete)

      audio_processing_service = double
      allow(AudioProcessingService).to receive(:new) { audio_processing_service }
      allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
      allow(audio_processing_service).to receive(:duration) { 123 }
      allow(audio_processing_service).to receive(:generate_waveform) { [0] }
      allow(audio_processing_service).to receive(:dispose)

      post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
    end

    before do
      put "/posts/#{post.id}",
          params: { post: { audio_uploads_attributes: [{ id: post.audio_uploads.first.id, _destroy: true }] } }
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "should delete the audio upload record" do
      audio_upload = AudioUpload.where(post_id: post.id).first
      expect(audio_upload).to eq nil
    end

    it "deletes the audio object from S3" do
      expect(s3_bucket).to have_received(:object).with("abc.mp3")
      expect(s3_object).to have_received(:delete)
    end
  end

  context "when a post has a new audio upload" do
    let(:user) { create(:user) }
    let(:post) { create(:post, user: user, audio_uploads: []) }

    before(:each) do
      sign_in user

      audio_processing_service = double
      allow(AudioProcessingService).to receive(:new) { audio_processing_service }
      allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
      allow(audio_processing_service).to receive(:duration) { 123 }
      allow(audio_processing_service).to receive(:generate_waveform) { [0] }
      allow(audio_processing_service).to receive(:dispose)
    end

    before { put "/posts/#{post.id}", params: { post: { audio_uploads_attributes: [{ public_id: "abc.mp3" }] } } }

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "should create the audio upload record" do
      expect(Post.find_by(id: post.id).audio_uploads.first.public_id).to eq "abc.mp3"
    end
  end
end

RSpec.describe "POST /posts", type: :request do
  let(:user) { create(:user) }
  let(:owner_user) { create(:user) }
  let(:artist_page) { create(:artist_page, approved: true) }
  let(:post_params) do
    {
      post: {
        artist_page_id: artist_page.id,
        title: "test",
        body: "test test",
        images: [{ url: "url1", public_id: "public_id1" }]
      }
    }
  end

  context "when user is unauthenticated" do
    before { post "/artist_pages/#{artist_page.id}/posts", params: post_params }

    it "returns 400" do
      expect(response.status).to eq 400
    end
  end

  context "when user doesn't own the page" do
    before do
      sign_in user
      post "/artist_pages/#{artist_page.id}/posts", params: post_params
    end

    it "returns 400" do
      expect(response.status).to eq 400
    end
  end

  context "when the user owns the artist page" do
    before do
      owner_user.owned_pages << artist_page
      sign_in owner_user
      post "/artist_pages/#{artist_page.id}/posts", params: post_params
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end
  end

  context "when viewing the artist page" do
    before do
      owner_user.owned_pages << artist_page
      sign_in owner_user
      post "/artist_pages/#{artist_page.id}/posts", params: post_params
    end

    it "the post appears in the page with correct data" do
      get "/artist_pages/#{artist_page.id}.json"
      expect(JSON.parse(response.body)["posts"][0]["title"]).to eq("test")
      expect(JSON.parse(response.body)["posts"][0]["author"]).to eq(owner_user.name)
    end

    it "the post appears in the page with correct image data" do
      get "/artist_pages/#{artist_page.id}.json"
      image = JSON.parse(response.body)["posts"].first["images"].first
      expect(image).to include("id")
      expect(image["url"]).to eq("url1")
      expect(image["public_id"]).to eq("public_id1")
    end
  end

  context "when post has bandcamp iframe" do
    let(:embed_url) do
      '<iframe style="border: 0; width: 100%; height: 120px;" ' \
        'src="https://bandcamp.com/EmbeddedPlayer/album=2397410510/size=large/' \
        'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
        '<a href="https://heladonegro.bandcamp.com/album/far-in">Far In by Helado Negro</a></iframe>'
    end
    let(:post_params) do
      {
        post: {
          artist_page_id: artist_page.id,
          title: "test",
          body: "test test",
          embed_url: embed_url
        }
      }
    end
    before do
      owner_user.owned_pages << artist_page
      sign_in owner_user

      post "/artist_pages/#{artist_page.id}/posts", params: post_params
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "sets on embed_url on posts" do
      expect(Post.last.embed_url).to eq(embed_url)
    end

    context "and javascript is added to the end" do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" ' \
          'src="https://bandcamp.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="https://heladonegro.bandcamp.com/album/far-in">Far In by Helado Negro</a></iframe>' \
          "<script> alert(1); </script>"
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and iframe contains javascript" do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" ' \
          'src="https://bandcamp.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          "<script>alert(1);</script></iframe>"
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and iframe attribute javascript" do
      let(:embed_url) do
        '<iframe style="javascript:alert(1);" ' \
          'src="https://bandcamp.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="https://heladonegro.bandcamp.com/album/far-in">Far In by Helado Negro</a></iframe>'
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and iframe contains unexpected attribute" do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" onClick="foo" ' \
          'src="https://bandcamp.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="https://heladonegro.bandcamp.com/album/far-in">Far In by Helado Negro</a></iframe>'
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and iframe points to something other than bandcamp" do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" ' \
          'src="https://spotify.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="https://heladonegro.bandcamp.com/album/far-in">Far In by Helado Negro</a></iframe>'
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and a href contains javascript" do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" ' \
          'src="https://bandcamp.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="javascript:alert(1);">Far In by Helado Negro</a></iframe>'
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and a contains unexpected attributes" do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" ' \
          'src="https://band.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="https://heladonegro.bandcamp.com/album/far-in" style="fsada">Far In by Helado Negro</a></iframe>'
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and a href points to something other than bandcamp " do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" ' \
          'src="https://band.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="https://heladonegro.spotify.com/album/far-in" style="fsada">Far In by Helado Negro</a></iframe>'
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and javascript is includ in a" do
      let(:embed_url) do
        '<iframe style="border: 0; width: 100%; height: 120px;" ' \
          'src="https://band.com/EmbeddedPlayer/album=2397410510/size=large/' \
          'bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless>' \
          '<a href="https://heladonegro.spotify.com/album/far-in" style="fsada"><script>fdaf</script></a></iframe>'
      end

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end
  end

  context "when the post has audio" do
    let(:hash_key) { "fake_hash" }
    let(:duration) { 110 }
    let(:waveform) { [20, 55, 23, 2, 80] }
    let(:audio_processing_service) { double }

    before do
      owner_user.owned_pages << artist_page
      sign_in owner_user

      post_params = {
        post: {
          artist_page_id: artist_page.id,
          title: "test",
          body: "test test",
          audio_uploads_attributes: [{
            public_id: "abc.mp3"
          }]
        }
      }

      allow(AudioProcessingService).to receive(:new) { audio_processing_service }
      allow(audio_processing_service).to receive(:generate_hash) { hash_key }
      allow(audio_processing_service).to receive(:duration) { duration }
      allow(audio_processing_service).to receive(:generate_waveform) { waveform }
      allow(audio_processing_service).to receive(:dispose)

      post "/artist_pages/#{artist_page.id}/posts", params: post_params
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "should create audio upload record" do
      get "/artist_pages/#{artist_page.id}.json"
      expect(JSON.parse(response.body)["posts"][0]["audio_uploads"][0]["public_id"]).to eq("abc.mp3")
    end

    it "should have audio processing service generate hash_key" do
      expect(AudioProcessingService).to have_received(:new).with("abc.mp3")
      expect(audio_processing_service).to have_received(:generate_hash)

      get "/artist_pages/#{artist_page.id}.json"
      expect(JSON.parse(response.body)["posts"][0]["audio_uploads"][0]["hash_key"]).to eq(hash_key)
    end

    it "should get duration from audio processing service" do
      expect(AudioProcessingService).to have_received(:new).with("abc.mp3")
      expect(audio_processing_service).to have_received(:duration)

      get "/artist_pages/#{artist_page.id}.json"
      expect(JSON.parse(response.body)["posts"][0]["audio_uploads"][0]["duration"]).to eq(duration)
    end

    it "should have audio processing service generate waveform" do
      expect(AudioProcessingService).to have_received(:new).with("abc.mp3")
      expect(audio_processing_service).to have_received(:generate_waveform)

      get "/artist_pages/#{artist_page.id}.json"
      expect(JSON.parse(response.body)["posts"][0]["audio_uploads"][0]["waveform"]).to eq(waveform)
    end
  end
end

RSpec.describe "Download posts", :vcr, type: :request do
  let(:supporter_user) do
    create(:user, stripe_customer_id: "cus_FfMNyx9ktbGwnx", confirmed_at: Time.current, email: "user@ampled.com")
  end
  let(:public_user) { create(:user) }
  let(:artist_page) { create(:artist_page, approved: true, slug: "test") }
  let(:public_download_post) do
    create(
      :post,
      artist_page_id: artist_page.id,
      title: "test",
      body: "test test",
      allow_download: true
    )
  end
  let(:private_download_post) do
    create(
      :post,
      artist_page_id: artist_page.id,
      title: "test",
      body: "test test",
      allow_download: true,
      is_private: true
    )
  end
  let(:public_no_download_post) do
    create(
      :post,
      artist_page_id: artist_page.id,
      title: "test",
      body: "test test",
      allow_download: false
    )
  end
  let(:public_no_audio_post) do
    create(
      :post,
      artist_page_id: artist_page.id,
      title: "test",
      body: "test test",
      allow_download: true,
      is_private: true
    )
  end
  let(:create_sub_url) { "/subscriptions/" }

  let(:create_sub_params) do
    {
      artist_page_id: artist_page.id,
      amount: 10_000
    }
  end
  let(:existing_stripe_auth) { JSON.parse(File.read("stripe_account_stub.json")) }

  before(:each) do
    audio_processing_service = double
    allow(AudioProcessingService).to receive(:new) { audio_processing_service }
    allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
    allow(audio_processing_service).to receive(:duration) { 123 }
    allow(audio_processing_service).to receive(:generate_waveform) { [0] }
    allow(audio_processing_service).to receive(:dispose)

    public_download_post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
    private_download_post.audio_uploads << AudioUpload.new(public_id: "def.mp3")
    public_no_download_post.audio_uploads << AudioUpload.new(public_id: "ghi.mp3")
  end

  context "when user is unauthenticated" do
    context "downloading a public downloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{public_download_post.id}/download" }
      it "returns 302" do
        expect(response.status).to eq 302
      end
    end

    context "downloading a private downloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{private_download_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end

    context "downloading a public undownloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{public_no_download_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end

    context "downloading a public downloadable post with no audio" do
      before { get "/artist/#{artist_page.slug}/post/#{public_no_audio_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end
  end

  context "when user is authenticated but doesn't support" do
    before(:each) do
      sign_in public_user
    end

    context "downloading a public downloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{public_download_post.id}/download" }
      it "returns 302" do
        expect(response.status).to eq 302
      end
    end

    context "downloading a private downloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{private_download_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end

    context "downloading a public undownloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{public_no_download_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end

    context "downloading a public downloadable post with no audio" do
      before { get "/artist/#{artist_page.slug}/post/#{public_no_audio_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end
  end

  context "when user is a supporter" do
    before do
      artist_page.update(stripe_user_id: existing_stripe_auth["stripe_user_id"])
      sign_in supporter_user
      # This seems to work to get a subscription going.
      post create_sub_url, params: create_sub_params
    end

    before(:each) do
      sign_in supporter_user
    end

    context "downloading a public downloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{public_download_post.id}/download" }
      it "returns 302" do
        expect(response.status).to eq 302
      end
    end

    context "downloading a private downloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{private_download_post.id}/download" }
      it "returns 302" do
        expect(response.status).to eq 302
      end
    end

    context "downloading a public undownloadable post" do
      before { get "/artist/#{artist_page.slug}/post/#{public_no_download_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end

    context "downloading a public downloadable post with no audio" do
      before { get "/artist/#{artist_page.slug}/post/#{public_no_audio_post.id}/download" }
      it "returns 404" do
        expect(response.status).to eq 404
      end
    end
  end
end

RSpec.describe "GET /posts", type: :request do
  let(:admin_user) do
    create(:user, confirmed_at: Time.current, admin: true)
  end
  let(:author_user) { create(:user) }
  let(:artist_page) { create(:artist_page) }
  let(:post_params) do
    {
      post: {
        artist_page_id: artist_page.id,
        title: "test",
        body: "test test"
      }
    }
  end

  before do
    sign_in author_user
    author_user.owned_pages << artist_page
    post "/artist_pages/#{artist_page.id}/posts", params: post_params
    sign_out author_user
  end

  context "when user is unauthenticated" do
    before do
      get "/posts.json"
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "does not contain any posts" do
      expect(JSON.parse(response.body)).to eq []
    end
  end

  context "when user is regular" do
    before do
      sign_in author_user
      get "/posts.json"
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "does not contain any posts" do
      expect(JSON.parse(response.body)).to eq []
    end
  end

  context "when user is an admin" do
    before do
      sign_in admin_user
      get "/posts.json"
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "contains any posts" do
      expect(JSON.parse(response.body).count).to be > 0
    end
  end
end

RSpec.describe "GET /slug/:artist/post/:postid", :vcr, type: :request do
  let(:supporter_user) do
    create(:user, stripe_customer_id: "cus_FfMNyx9ktbGwnx", confirmed_at: Time.current, email: "user@ampled.com")
  end
  let(:public_user) { create(:user) }
  let(:artist_page) { create(:artist_page, approved: true, slug: "test") }
  let(:public_download_post) do
    create(:post, artist_page_id: artist_page.id, title: "test",
           body: "test test", allow_download: true)
  end
  let(:private_download_post) do
    create(:post, artist_page_id: artist_page.id, title: "test",
           body: "test test", allow_download: true, is_private: true)
  end
  let(:create_sub_url) { "/subscriptions/" }

  let(:create_sub_params) do
    {
      artist_page_id: artist_page.id,
      amount: 10_000
    }
  end
  let(:existing_stripe_auth) { JSON.parse(File.read("stripe_account_stub.json")) }

  before(:each) do
    audio_processing_service = double
    allow(AudioProcessingService).to receive(:new) { audio_processing_service }
    allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
    allow(audio_processing_service).to receive(:duration) { 123 }
    allow(audio_processing_service).to receive(:generate_waveform) { [0] }
    allow(audio_processing_service).to receive(:dispose)

    public_download_post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
    private_download_post.audio_uploads << AudioUpload.new(public_id: "def.mp3")
  end

  context "when user is unauthenticated" do
    context "viewing a public post" do
      before { get "/slug/#{artist_page.slug}/post/#{public_download_post.id}.json" }
      it "shows details of a public post" do
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)["allow_details"]).to eq true
      end
    end

    context "viewing a private post" do
      before { get "/slug/#{artist_page.slug}/post/#{private_download_post.id}.json" }
      it "hides details of a private post" do
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)["allow_details"]).to be_nil
      end
    end
  end

  context "when user is authenticated but doesn't support" do
    before(:each) do
      sign_in public_user
    end

    context "viewing a public post" do
      before { get "/slug/#{artist_page.slug}/post/#{public_download_post.id}.json" }
      it "shows details of a public post" do
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)["allow_details"]).to eq true
      end
    end

    context "viewing a private post" do
      before { get "/slug/#{artist_page.slug}/post/#{private_download_post.id}.json" }
      it "hides details of a private post" do
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)["allow_details"]).to be_nil
      end
    end
  end

  context "when user is a supporter" do
    before do
      artist_page.update(stripe_user_id: existing_stripe_auth["stripe_user_id"])
      sign_in supporter_user
      # This seems to work to get a subscription going.
      post create_sub_url, params: create_sub_params
    end

    before(:each) do
      sign_in supporter_user
    end

    context "viewing a public post" do
      before { get "/slug/#{artist_page.slug}/post/#{public_download_post.id}.json" }
      it "shows details of a public post" do
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)["allow_details"]).to eq true
      end
    end

    context "viewing a private post" do
      before { get "/slug/#{artist_page.slug}/post/#{private_download_post.id}.json" }
      it "shows details of a private post" do
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)["allow_details"]).to eq true
      end
    end
  end
end
