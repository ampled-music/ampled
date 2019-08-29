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

  context "when the user owns the artist page where the post lives" do
    let(:user) { create(:user) }
    let(:artist_page) { create(:artist_page) }
    let(:post) { create(:post, artist_page: artist_page) }

    before do
      user.owned_pages << artist_page
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
