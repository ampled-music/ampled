require "rails_helper"

RSpec.describe ArtistPagesController, type: :request do
  let(:user) { create(:user, confirmed_at: Time.current, email: "creator@ampled.com") }
  let(:friend_user) { create(:user, confirmed_at: Time.current, email: "testfriend@ampled.com") }

  let(:create_params) do
    {
      name: "Test",
      slug: "testslug",
      members: ["testfriend@ampled.com"]
    }
  end

  let(:missing_create_params) do
    {
      slug: "sluggy",
      members: [
        { email: "creator@ampled.com" },
        { email: "testfriend@ampled.com" }
      ]
    }
  end

  context "when creating an artist page" do
    let(:url) { "/artist_pages.json" }

    it "stops unconfirmed users from creating" do
      post url, params: create_params

      expect(JSON.parse(response.body)["status"]).to eq "error"
    end

    it "fails on missing mandatory params" do
      sign_in user
      post url, params: missing_create_params

      expect(JSON.parse(response.body)["status"]).to eq "error"
    end

    xit "allows confirmed users to create" do
      sign_in user
      post url, params: create_params

      expect(JSON.parse(response.body)["message"]).to eq "Your page has been created!"
    end

    xit "stops duplicate slugs" do
      sign_in user
      post url, params: create_params

      expect(JSON.parse(response.body)["status"]).to eq "error"
    end
  end
end
