require "rails_helper"

RSpec.describe Test::DatabasesController, type: :request do
  describe "GET /test/reset_database" do
    let(:path) { "/test/reset_database" }

    it "removes previous data from the database" do
      old_objects = create_list(:user, 3) + create_list(:post, 2)

      get path

      old_objects.each do |old_obj|
        expect { old_obj.reload }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    it "does not delete migration version data" do
      get path

      expect(ApplicationRecord.connection.migration_context.current_version).to_not be_nil
    end

    it "seeds the database with new data" do
      get path

      expect(User.find_by(email: "fake.admin@ampled.com")).to_not be_nil
      expect(ArtistPage.count).to eq(5)
    end
  end
end
