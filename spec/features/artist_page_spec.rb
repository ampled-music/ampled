require "rails_helper"

RSpec.describe ArtistPagesController, type: :request do
  let(:user) { create(:user, confirmed_at: Time.current) }
  let(:supporter) { create(:user, confirmed_at: Time.current) }

  let(:image) { create(:image) }
  let(:artist_page) { create(:artist_page, slug: "test", approved: true, images: [image], accent_color: "#0f0f0f") }
  let(:artist_page_unapproved) { create(:artist_page, slug: "unapproved", approved: false) }

  before(:each) do
    sign_in user
  end

  context "when loading all artist_pages" do
    let(:url) { "/artist_pages.json" }

    it "returns 200" do
      get url

      expect(response.status).to eq 200
    end

    it "responds with a JSON array" do
      get url

      expect(JSON.parse(response.body)["pages"]).to be_a(Array)
    end
  end

  context "when loading browse artist pages with a random seed" do
    let!(:approved_page_one) { create(:artist_page, approved: true) }
    let!(:approved_page_two) { create(:artist_page, approved: true) }

    let(:url) { "/artists/browse.json?seed=0.237894" }
    let(:url_page_two) { "/artists/browse.json?seed=0.237894&page=2" }
    let(:url_artist_owners) { "/artists/browse.json?seed=0.237894&artist_owners=true" }

    let(:image) { "https://res.cloudinary.com/ampled-web/image/upload/b_rgb:ddbdac33/social/Story/Story5.png" }

    before do
      approved_page_one.images.create(url: image)
      approved_page_two.images.create(url: image)
    end

    before(:each) do
      get url
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "responds with a JSON array" do
      expect(JSON.parse(response.body)["pages"]).to be_a(Array)
    end

    it "responds consistently given the same seed" do
      response_one = JSON.parse(response.body)
      get url
      expect(JSON.parse(response.body)).to eq response_one
    end

    it "distinguishes pages correctly" do
      response_one = JSON.parse(response.body)
      get url_page_two
      expect(JSON.parse(response.body)).to_not eq response_one
    end

    it "handles gracefully artist pages with no images" do
      approved_page_one.images.destroy_all
      get url
      expect(response.status).to eq 200
    end

    it "excludes non artist owners when artist_owners param is passed" do
      response_one = JSON.parse(response.body)

      approved_page_one.update(artist_owner: true)

      get url_artist_owners

      expect(JSON.parse(response.body)).to_not eq response_one
    end
  end

  context "when loading approved artist_page data" do
    let(:url) { "/artist_pages/#{artist_page.id}.json" }
    let(:slugurl) { "/slug/#{artist_page.slug}.json" }

    it "returns 200" do
      get url

      expect(response.status).to eq 200
    end

    it "responds with JSON including the artist_page id" do
      get url

      expect(JSON.parse(response.body)["id"]).to eq artist_page.id
    end

    it "responds with JSON including the artist_page slug" do
      get slugurl

      expect(JSON.parse(response.body)["slug"]).to eq artist_page.slug
    end

    it "responds with JSON including the page images and their attributes" do
      get url

      body = JSON.parse(response.body)
      expect(body["images"]).to eq([
        { "coordinates" => image.coordinates, "id" => image.id, "url" => image.url, "public_id" => image.public_id }
      ])
    end

    xit "includes active supporter data" do
      create(:subscription, user: supporter, artist_page: artist_page)
      get url

      expect(JSON.parse(response.body)["supporters"].first["id"]).to eq supporter.id
    end

    xit "does not include subscribers that are not active" do
      create(:subscription, user: supporter, artist_page: artist_page, status: :cancelled)
      get url

      expect(JSON.parse(response.body)["supporters"].count).to eq 0
    end
  end

  context "when loading unapproved artist_page data as an anonymous user" do
    let(:url) { "/artist_pages/#{artist_page_unapproved.id}.json" }
    let(:slugurl) { "/slug/#{artist_page_unapproved.slug}.json" }

    it "returns 200" do
      get url

      expect(response.status).to eq 200
    end

    it "does not include owner data" do
      get url

      expect(JSON.parse(response.body)["owners"]).to be_nil
    end
  end

  describe "#subscribers_csv" do
    let(:admin) { create(:user, admin: true) }
    let(:url) { "/artist/#{artist_page.slug}/subscribers_csv" }
    let!(:subscription) { create(:subscription, user: supporter, artist_page: artist_page) }

    let(:ex_supporter) { create(:user, confirmed_at: Time.current) }
    let!(:cancelled_subscription) do
      create(:subscription, user: ex_supporter, artist_page: artist_page, status: :cancelled)
    end

    context "when current user is not an admin" do
      it "returns a 403 forbidden error" do
        get url
        expect(response.status).to eq(403)
      end

      it "returns no subscriber data" do
        get url
        expect(response.body).to_not include(supporter.email)
      end
    end

    context "when current user is admin" do
      before do
        sign_in admin
      end

      it "returns 200" do
        get url
        expect(response.status).to eq(200)
      end

      it "returns csv with subscriber list" do
        get url
        actual_csv = CSV.parse(response.body)
        expect(actual_csv).to include(["Name", "Last Name", "Email"])
        expect(actual_csv).to include([supporter.name, supporter.last_name, supporter.email])
      end

      it "returns csv without cancelled subscribers" do
        get url
        actual_csv = CSV.parse(response.body)
        expect(actual_csv).to include(["Name", "Last Name", "Email"])
        expect(actual_csv).to_not include([ex_supporter.name, ex_supporter.last_name, ex_supporter.email])
      end
    end
  end
end

RSpec.describe "PUT /artist_page", type: :request do
  context "when user is unauthenticated" do
    let(:artist_page) { create(:artist_page, slug: "test", approved: true, name: "old name") }
    before { put "/artist_pages/#{artist_page.id}.json", params: { artist_page: { name: "new name" } } }

    it "does not update the post" do
      expect(artist_page.reload.name).to eq "old name"
    end
  end

  context "when updating application_fee_percent" do
    let(:artist_page) { create(:artist_page, application_fee_percent: 5.21) }
    let(:user) { create(:user, confirmed_at: Time.zone.now) }
    let!(:ownership) { PageOwnership.create(user: user, artist_page: artist_page, role: "admin") }

    before do
      sign_in user
    end

    it "queues the UpdateApplicationFeePercentJob with the correct parameters" do
      expect {
        put(
          "/artist_pages/#{artist_page.id}.json",
          params: {
            artist_page: {
              application_fee_percent: 34.21
            }
          }
        )
      }.to change { UpdateApplicationFeePercentJob.jobs.count }.by(1)

      expect(UpdateApplicationFeePercentJob.jobs.last["args"]).to match_array(
        [artist_page.id, "34.21"]
      )
    end
  end

  context "when not updating application_fee_percent" do
    let(:artist_page) { create(:artist_page) }
    let(:user) { create(:user, confirmed_at: Time.zone.now) }
    let!(:ownership) { PageOwnership.create(user: user, artist_page: artist_page, role: "admin") }

    before do
      sign_in user
    end

    it "does not queue the UpdateApplicationFeePercentJob" do
      expect {
        put(
          "/artist_pages/#{artist_page.id}.json",
          params: {
            artist_page: {
              name: "Kitteh' Rock: The Sequel"
            }
          }
        )
      }.to change { UpdateApplicationFeePercentJob.jobs.count }.by(0)
    end
  end

  context "when a user is unconfirmed" do
    let(:artist_page) { create(:artist_page, slug: "test", approved: true, name: "old name") }
    let(:user) { create(:user, confirmed_at: nil) }

    before(:each) do
      sign_in user
    end

    before { put "/artist_pages/#{artist_page.id}.json", params: { artist_page: { name: "new name" } } }
    it "does not update the post" do
      expect(artist_page.reload.name).to eq "old name"
    end

    it "returns an error telling the user they need to confirm" do
      expect(JSON.parse(response.body)["message"]).to match("Please confirm your email")
    end
  end

  context "when adding new members to the page" do
    let(:user) { create(:user, confirmed_at: Time.zone.now) }
    let(:artist_page) { create(:artist_page, slug: "test", approved: true, name: "old name") }
    let!(:ownership) { PageOwnership.create(user: user, artist_page: artist_page, role: "admin") }

    before(:each) do
      sign_in user
    end

    before do
      put "/artist_pages/#{artist_page.id}.json", params: {
        artist_page: { slug: "test" },
        members: [{ email: "new@user.com", firstName: "new", lastName: "user" }]
      }
    end

    xit "creates new users for members that do not yet exist" do
      expect(User.find_by(email: "new@user.com")).not_to be_nil
    end
  end

  context "when adding members that already belong to the platform" do
    let(:user) { create(:user, confirmed_at: Time.zone.now) }
    let(:user_member) { create(:user, name: "oldname") }
    let(:artist_page) { create(:artist_page, slug: "test", approved: true) }
    let!(:ownership) { PageOwnership.create(user: user, artist_page: artist_page, role: "admin") }

    before(:each) do
      sign_in user
    end

    before do
      put "/artist_pages/#{artist_page.id}.json", params: {
        artist_page: {
          members: [{ email: user_member.email, firstName: "new", lastName: "user" }]
        }
      }
    end

    it "does not try to create users for members that already exist" do
      expect(User.where(email: user_member.email).count).to eq(1)
      expect(User.find_by(email: user_member.email).name).to eq("oldname")
    end
  end
end
