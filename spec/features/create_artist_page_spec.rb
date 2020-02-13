require "rails_helper"

RSpec.describe ArtistPagesController, type: :request do
  let(:user) { create(:user, confirmed_at: Time.current, email: "creator@ampled.com", name: "Creator") }
  let(:other_artist_page) { create(:artist_page, slug: "test", approved: true) }

  let(:create_params) do
    {
      artist_page: {
        name: "Test",
        slug: "testslug7",
        bio: "About me",
        location: "Testville",
        accent_color: "#aabbcc"
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

  let(:bad_slug_params) do
    {
      artist_page: {
        name: "Test",
        slug: "666",
        bio: "About me",
        location: "Testville",
        accent_color: "#aabbcc"
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

  let(:update_params) do
    {
      artist_page: {
        bio: "About me",
        video_url: "https://www.youtube.com/watch?v=hHW1oY26kxQ"
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

  let(:bad_update_params) do
    {
      artist_page: {
        bio: "About me",
        slug: "newslug",
        video_url: "https://www.youtube.com/watch?v=hHW1oY26kxQ"
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

  let(:vimeo_update_params) do
    {
      artist_page: {
        bio: "About me",
        video_url: "https://vimeo.com/331608175"
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

    it "stops duplicate slugs" do
      sign_in user
      post url, params: create_params
      post url, params: create_params

      expect(JSON.parse(response.body)["status"]).to eq "error"
    end

    it "stops numeric slugs" do
      sign_in user
      post url, params: bad_slug_params

      expect(JSON.parse(response.body)["status"]).to eq "error"
    end
  end

  context "when updating an artist page" do
    let(:create_url) { "/artist_pages" }
    let(:other_url) { "/artist_pages/#{other_artist_page.id}" }
    let(:artist_page) { create(:artist_page) }

    before do
      user.owned_pages << artist_page
      PageOwnership.find_by(user_id: user[:id], artist_page_id: artist_page[:id]).update(role: "admin")
    end

    before(:each) do
      sign_in user
    end

    it "won't edit someone else's page" do
      put other_url, params: update_params

      expect(JSON.parse(response.body)["message"]).to eq "You don't have that permission."
    end

    it "will let admins edit their own page" do
      sign_in user
      put "/artist_pages/#{artist_page.id}", params: update_params
      expect(JSON.parse(response.body)["message"]).to eq "Your page has been updated!"
    end

    it "won't let admins change their slug" do
      sign_in user
      put "/artist_pages/#{artist_page.id}", params: bad_update_params
      expect(JSON.parse(response.body)["message"]).to eq "You can't change your URL or name."
    end

    it "pulls video screenshot url for youtube" do
      sign_in user
      put "/artist_pages/#{artist_page.id}", params: update_params
      expect(ArtistPage.find(artist_page.id)[:video_screenshot_url]).to eq "https://img.youtube.com/vi/hHW1oY26kxQ/0.jpg"
    end

    it "pulls video screenshot url for vimeo", vcr: true do
      sign_in user
      put "/artist_pages/#{artist_page.id}", params: vimeo_update_params
      expect(ArtistPage.find(artist_page.id)[:video_screenshot_url]).to eq "https://i.vimeocdn.com/video/777053973_640.jpg"
    end
  end

  context "when attempting to delete another users' page" do
    let(:user) { create(:user) }
    let(:artist_page) { create(:artist_page) }

    before(:each) do
      sign_in user
    end

    before { delete "/artist_pages/#{artist_page.id}" }

    it "returns an error" do
      expect(JSON.parse(response.body)["message"]).to eq "You don't have that permission."
    end

    it "does not delete the page" do
      expect(ArtistPage.find(artist_page.id)).to eq artist_page
    end
  end

  context "when attempting to delete your own page" do
    let(:user) { create(:user) }
    let(:artist_page) { create(:artist_page) }

    before do
      user.owned_pages << artist_page
      PageOwnership.find_by(user_id: user[:id], artist_page_id: artist_page[:id]).update(role: "admin")
    end

    before(:each) do
      sign_in user
    end

    before { delete "/artist_pages/#{artist_page.id}" }

    it "returns success" do
      expect(JSON.parse(response.body)["message"]).to eq "Your page has been deleted!"
    end

    it "deletes the page" do
      expect(ArtistPage.find_by(id: artist_page.id)).to eq nil
    end
  end

  context "when an artist page owner gets me.json the ownedPages data" do
    let(:user) { create(:user) }
    let(:artist_page) { create(:artist_page) }

    before do
      user.owned_pages << artist_page
      PageOwnership.find_by(user_id: user[:id], artist_page_id: artist_page[:id]).update(role: "admin")
    end

    before(:each) do
      sign_in user
    end

    before { get "/me.json" }

    it "contains a stripe signup url" do
      expect(JSON.parse(response.body)["ownedPages"][0]["stripeSignup"]).not_to be_empty
    end

    it "contains a numeric supporter count" do
      expect(JSON.parse(response.body)["ownedPages"][0]["supportersCount"]).to be_a(Integer)
    end
  end
end
