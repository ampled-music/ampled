require "rails_helper"

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
end

RSpec.describe "PUT /posts", type: :request do
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
    let(:post) { create(:post, user: user, title: "my old title") }

    before(:each) do
      sign_in user
    end

    before { put "/posts/#{post.id}", params: { post: { title: "my new title" } } }

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "updates the post" do
      expect(Post.find_by(id: post.id).title).to eq "my new title"
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
        body: "test test"
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
  end
end

RSpec.describe "Download posts", :vcr, type: :request do
  let(:supporter_user) do
    create(:user, stripe_customer_id: "cus_FfMNyx9ktbGwnx", confirmed_at: Time.current, email: "user@ampled.com")
  end
  let(:public_user) { create(:user) }
  let(:artist_page) { create(:artist_page, approved: true, slug: "test") }
  let(:public_download_post) do
    create(:post, artist_page_id: artist_page.id, title: "test",
           body: "test test", allow_download: true,
           audio_uploads: [AudioUpload.new(public_id: "62278a79-1221-4f5a-85b3-9c21af6ffbf8.mp3")])
  end
  let(:private_download_post) do
    create(:post, artist_page_id: artist_page.id, title: "test",
           body: "test test", allow_download: true, is_private: true,
           audio_uploads: [AudioUpload.new(public_id: "62278a79-1221-4f5a-85b3-9c21af6ffbf8.mp3")])
  end
  let(:public_no_download_post) do
    create(:post, artist_page_id: artist_page.id, title: "test",
           body: "test test", allow_download: false,
           audio_uploads: [AudioUpload.new(public_id: "62278a79-1221-4f5a-85b3-9c21af6ffbf8.mp3")])
  end
  let(:public_no_audio_post) do
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
           body: "test test", allow_download: true,
           audio_file: "62278a79-1221-4f5a-85b3-9c21af6ffbf8.")
  end
  let(:private_download_post) do
    create(:post, artist_page_id: artist_page.id, title: "test",
           body: "test test", allow_download: true, is_private: true,
           audio_file: "62278a79-1221-4f5a-85b3-9c21af6ffbf8.")
  end
  let(:create_sub_url) { "/subscriptions/" }

  let(:create_sub_params) do
    {
      artist_page_id: artist_page.id,
      amount: 10_000
    }
  end
  let(:existing_stripe_auth) { JSON.parse(File.read("stripe_account_stub.json")) }

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
