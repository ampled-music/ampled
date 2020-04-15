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
end
