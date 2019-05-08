require "rails_helper"

RSpec.describe ArtistPagesController, type: :request do
  let(:user) { create(:user, confirmed_at: Time.current) }
  let(:supporter) { create(:user, confirmed_at: Time.current) }

  let(:artist_page) { create(:artist_page) }

  before(:each) do
    sign_in user
  end

  context "when loading artist_page data" do
    let(:url) { "/artist_pages/#{artist_page.id}.json" }

    it "returns 200" do
      get url

      expect(response.status).to eq 200
    end

    it "responds with JSON including the artist_page id" do
      get url

      expect(JSON.parse(response.body)["id"]).to eq artist_page.id
    end

    it "includes active supporter data" do
      create(:subscription, user: supporter, artist_page: artist_page)
      get url

      expect(JSON.parse(response.body)["supporters"].first["id"]).to eq supporter.id
    end

    it "does not include subscribers that are not active" do
      create(:subscription, user: supporter, artist_page: artist_page, status: :cancelled)
      get url

      expect(JSON.parse(response.body)["supporters"].count).to eq 0
    end
  end
end
