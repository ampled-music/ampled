require "./spec/support/rake_helpers"
require "rails_helper"

# Tasks to help manage images stored in Cloudinary.
# To run on Heroku:
# $ heroku run rake images:soft_delete_unused --app <ampled-web | ampled-web-prod>

RSpec.describe "images.rake" do
  describe "images:soft_delete_unused" do
    let(:task) { "images:soft_delete_unused" }

    # Scaffolding for fake Cloudinary API response.
    # Public id array will be filled by each test context.
    let(:cloudinary_public_ids) { [] }
    let(:cloudinary_result) do
      {
        "resources" => cloudinary_public_ids.map { |id| { "public_id" => id } }
      }
    end

    before :each do
      allow(Cloudinary::Api).to receive(:resources).and_return(cloudinary_result)
      allow(Cloudinary::Uploader).to receive(:rename)
    end

    context "when an image is in Cloudinary but not in the database" do
      let(:cloudinary_public_ids) { ["extremely_unused_id"] }

      it "is soft-deleted" do
        RakeHelpers.run_task(task)
        expect(Cloudinary::Uploader).to have_received(:rename)
          .with("extremely_unused_id", "soft_deleted/extremely_unused_id")
      end
    end

    context "when an image is in Cloudinary and in the database" do
      let(:image) { create(:image) }
      let(:cloudinary_public_ids) { [image.public_id] }

      it "skips the image without soft-deleting it" do
        expect(Cloudinary::Uploader).to_not receive(:rename)
        RakeHelpers.run_task(task)
      end
    end

    context "when there are multiple pages of Cloudinary resources" do
      let(:images_first_page) { create_list(:image, 5) }
      let(:deletable_image_ids) { %w[fake_id_1 fake_id_2] }
      let(:cloudinary_first_result) do
        {
          "resources" => images_first_page.map { |img| { "public_id" => img.public_id } },
          "next_cursor" => "fake_cursor_for_next_page"
        }
      end
      let(:cloudinary_second_result) do
        {
          "resources" => deletable_image_ids.map { |id| { "public_id" => id } }
        }
      end

      before do
        allow(Cloudinary::Api).to receive(:resources).and_return(cloudinary_first_result, cloudinary_second_result)
      end

      it "processes all the pages" do
        RakeHelpers.run_task(task)
        expect(Cloudinary::Api).to have_received(:resources).twice
        expect(Cloudinary::Uploader).to have_received(:rename).exactly(deletable_image_ids.length).times
      end
    end
  end

  describe "images:empty_soft_deleted" do
    let(:task) { "images:empty_soft_deleted" }

    let(:cloudinary_result_1) do
      {
        "resources" => [{ "public_id" => "id1" }, { "public_id" => "id2" }],
        "next_cursor" => "some_cursor_thingie"
      }
    end

    let(:cloudinary_result_2) do
      {
        "resources" => [{ "public_id" => "id3" }, { "public_id" => "id4" }]
      }
    end

    before :each do
      allow(Cloudinary::Api).to receive(:resources).and_return(cloudinary_result_1, cloudinary_result_2)
      allow(Cloudinary::Uploader).to receive(:destroy)
    end

    it "requests resources with the SOFT_DELETED_FOLDER prefix" do
      RakeHelpers.run_task(task)
      expect(Cloudinary::Api).to have_received(:resources).with(hash_including(prefix: "soft_deleted")).twice
    end

    it "paginates through results and destroys all the resources it finds" do
      RakeHelpers.run_task(task)
      expect(Cloudinary::Api).to have_received(:resources).twice
      expect(Cloudinary::Uploader).to have_received(:destroy).exactly(4).times
    end
  end
end
