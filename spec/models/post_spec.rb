require "rails_helper"

RSpec.describe Post, type: :model do
  describe "#images" do
    let(:image) { create(:image) }
    let!(:post) { create(:post, images: [image]) }

    it "get deleted when owning Post is deleted" do
      expect {
        post.destroy!
      }.to change { Image.all.count }.by(-1)
    end

    it "can be set as nested attributes" do
      post_with_images = described_class.new(
        title: "New kitten jams",
        artist_page: create(:artist_page),
        user: create(:user),
        images_attributes: [
          { url: "http://first.jpg", public_id: "first_public_id" },
          { url: "http://second.jpg", public_id: "second_public_id" }
        ]
      )
      expect { post_with_images.save! }.to change { Image.all.count }.by(2)
      post_with_images.reload
      expect(post_with_images.images.first.url).to eq("http://first.jpg")
      expect(post_with_images.images.first.public_id).to eq("first_public_id")
      expect(post_with_images.images.last.url).to eq("http://second.jpg")
      expect(post_with_images.images.last.public_id).to eq("second_public_id")
    end
  end
end
