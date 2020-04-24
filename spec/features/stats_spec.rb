require "rails_helper"

RSpec.describe "GET /stats/summary.json", type: :request do
  let(:admin_user) { create(:user, confirmed_at: Time.current, admin: true) }
  let(:regular_user) { create(:user, confirmed_at: Time.current) }

  let(:artist_page) { create(:artist_page, slug: "test", approved: true) }
  let(:artist_page_unapproved) { create(:artist_page, slug: "unapproved", approved: false) }

  let(:url) { "/stats/summary.json" }

  context "as a regular user" do
    before(:each) do
      sign_in regular_user
      get url
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "responds with an error" do
      expect(JSON.parse(response.body)["status"]).to eq "error"
    end
  end

  context "as an admin user" do
    before(:each) do
      sign_in admin_user
      get url
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "responds with data" do
      expect(JSON.parse(response.body)["counts"]).to be_a Array
    end
  end
end
