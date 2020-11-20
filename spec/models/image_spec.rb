require "rails_helper"
require "shared_context/cloudinary_stub"

RSpec.describe Image, type: :model do
  include_context "cloudinary_stub"

  subject { described_class.new }

  describe "#imageable" do
    let(:artist_page) { create(:artist_page) }
    let(:user) { create(:user) }

    it "is a polymorphic relationship that supports different model types" do
      [artist_page, user].each do |some_imageable|
        subject.imageable = some_imageable
        subject.save!
        expect(subject.reload.imageable_type).to eq(some_imageable.class.name)
      end
    end
  end

  describe ".rename_params" do
    it "does nothing if the params don't include the requested object_key" do
      params = ActionController::Parameters.new(foo: { bar: "baz" })
      expect(Image.rename_params(params, :not_a_thing)).to eq(params)
    end

    it "does nothing if the params don't include an images attribute" do
      params = ActionController::Parameters.new(post: { bar: "baz" })
      expect(Image.rename_params(params, :post)).to eq(params)
    end

    it "renames the images attribute to images_attributes" do
      params = ActionController::Parameters.new(post: { images: %w[foo bar baz] })
      expect(Image.rename_params(params, :post)[:post][:images_attributes]).to eq(%w[foo bar baz])
    end
  end

  describe "before_destroy" do
    it "should call Cloudinary destroy" do
      allow(Cloudinary::Uploader)
        .to receive(:destroy)
        .and_return({})

      subject.destroy!

      expect(Cloudinary::Uploader)
        .to have_received(:destroy)
        .with(subject.public_id)
    end
  end
end
