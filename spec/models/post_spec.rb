require "rails_helper"
require "shared_context/cloudinary_stub"

RSpec.describe Post, type: :model do
  include_context "cloudinary_stub"

  describe "#images" do
    let(:image) { create(:image) }
    let!(:post) { create(:post, images: [image]) }

    it "get deleted when owning Post is deleted" do
      expect {
        post.destroy!
      }.to change(Image, :count).by(-1)
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
      expect { post_with_images.save! }.to change(Image, :count).by(2)
      post_with_images.reload
      expect(post_with_images.images.first.url).to eq("http://first.jpg")
      expect(post_with_images.images.first.public_id).to eq("first_public_id")
      expect(post_with_images.images.last.url).to eq("http://second.jpg")
      expect(post_with_images.images.last.public_id).to eq("second_public_id")
    end

    it "can be deleted through nested attributes" do
      post.images_attributes = [{ id: post.images.first.id, _destroy: true }]
      expect {
        post.save!
      }.to change(Image, :count).by(-1)
      expect(post.reload.images.size).to eq(0)
    end
  end

  describe "#author_image" do
    let(:author_image) { create(:image) }
    let(:author) { create(:user) }
    let(:post) { create(:post, user: author) }

    it "returns the author's image" do
      allow(author).to receive(:image).and_return(author_image)
      expect(post.author_image).to eq(author_image)
    end

    it "returns nil if the author has no image" do
      expect(author).to receive(:image).and_return(nil)
      expect(post.author_image).to eq(nil)
    end
  end
end
