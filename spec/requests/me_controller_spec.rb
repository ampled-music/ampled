require "rails_helper"

RSpec.describe MeController, type: :request do
  let(:url) { "/me.json" }
  let(:image) { create(:image) }
  let(:user) { create(:user, image: image) }

  describe "#index" do
    before do
      sign_in user
    end

    it "returns image object" do
      get url

      expect(JSON.parse(response.body)["userInfo"]["image"]).to eq(
        {
          "id" => image.id,
          "url" => image.url,
          "public_id" => image.public_id,
          "delete_token" => image.delete_token,
          "coordinates" => image.coordinates
        }
      )
    end
  end
end
