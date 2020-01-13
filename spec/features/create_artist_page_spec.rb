require "rails_helper"

RSpec.describe ArtistPagesController, type: :request do
  let(:user) { create(:user, confirmed_at: Time.current, email: "creator@ampled.com", name: "Creator") }

  let(:create_params) do
    {
      artist_page: {
        name: "Test",
        slug: "testslug",
        bio: "About me"
      },
      members: [
        {
          email: "creator@ampled.com",
          firstName: "Creator"
        },
        {
          email: "testfriend@ampled.com",
          firstName: "Friend"
        }
      ],
      images: ["http://ampled-web.herokuapp.com/static/media/ampled_logo_beta.1ce03b01.svg"]
    }
  end

  let(:missing_create_params) do
    {
      artist_page: {
        slug: "sluggy",
        bio: "About me"
      },
      members: [
        { email: "creator@ampled.com", firstName: "Creator" },
        { email: "testfriend@ampled.com", firstName: "Friend" }
      ],
      images: ["http://ampled-web.herokuapp.com/static/media/ampled_logo_beta.1ce03b01.svg"]
    }
  end

  context "when creating an artist page" do
    let(:url) { "/artist_pages" }

    it "stops unconfirmed users from creating" do
      post url, params: create_params

      expect(JSON.parse(response.body)["status"]).to eq "error"
    end

    it "fails on missing mandatory params" do
      sign_in user
      post url, params: missing_create_params

      expect(JSON.parse(response.body)["status"]).to eq "error"
    end

    it "allows confirmed users to create" do
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
