require "rails_helper"

RSpec.describe "DELETE /comments", type: :request do
  context "when user is unauthenticated" do
    let(:comment) { create(:comment) }
    before { delete "/comments/#{comment.id}" }

    it "returns an error message" do
      expect(JSON.parse(response.body)).to eq(
        "status" => "error",
        "message" => "Not allowed."
      )
    end

    it "does not delete the comment" do
      expect(Comment.find(comment.id)).to eq comment
    end
  end

  context "when user owns the comment" do
    let(:user) { create(:user) }
    let(:comment) { create(:comment, user: user) }

    before(:each) do
      sign_in user
    end

    before { delete "/comments/#{comment.id}" }

    it "returns 204" do
      expect(response.status).to eq 204
    end

    it "deletes the comment" do
      expect(Comment.find_by(id: comment.id)).to eq nil
    end
  end
end
