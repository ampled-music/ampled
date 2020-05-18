require "rails_helper"

RSpec.describe User, type: :model do
  describe "#image" do
    let(:image) { create(:image) }
    let!(:user) { create(:user, image: image) }

    it "gets deleted when owning User is deleted" do
      expect {
        user.destroy!
      }.to change(Image, :count).by(-1)
    end

    it "can be set via nested attributes" do
      user_with_image = described_class.new(
        name: "Alice Photogenic",
        email: "foo@bar.baz",
        password: "seekret",
        image_attributes: { url: "http://some-url.jpg", public_id: "some_public_id" }
      )
      expect { user_with_image.save! }.to change(Image, :count).by(1)
      user_with_image.reload
      expect(user_with_image.image.url).to eq("http://some-url.jpg")
      expect(user_with_image.image.public_id).to eq("some_public_id")
    end

    it "can be deleted through nested attributes" do
      user.image_attributes = { id: image.id, _destroy: true }
      expect {
        user.save!
      }.to change(Image, :count).by(-1)
      expect(user.reload.image).to eq(nil)
    end
  end
end
