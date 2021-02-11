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
          "coordinates" => image.coordinates
        }
      )
    end

    it "returns subscriptions" do
      first_plan = create(:plan, nominal_amount: 1758, currency: "usd")
      first_subscription = create(
        :subscription,
        user: user,
        artist_page: first_plan.artist_page,
        plan: first_plan,
        created_at: Time.new(2020, 10, 29, 14, 30, 23, "+00:00")
      )
      second_plan = create(:plan, nominal_amount: 1200, currency: "usd")
      second_subscription = create(
        :subscription,
        user: user,
        artist_page: second_plan.artist_page,
        plan: second_plan,
        created_at: Time.new(2020, 10, 29, 14, 34, 21, "+00:00")
      )

      get url

      expect(JSON.parse(response.body)["subscriptions"]).to eq([
        {
          "amount" => 1758,
          "artistApproved" => false,
          "artistColor" => nil,
          "artistPageId" => first_subscription.artist_page_id,
          "artistSlug" => nil,
          "image" => nil,
          "last_post_date" => nil,
          "name" => first_subscription.artist_page.name,
          "promoteSquareImages" => [nil, nil, nil, nil, nil, nil],
          "promoteStoryImages" => [nil, nil, nil, nil, nil, nil, nil],
          "subscriptionId" => first_subscription.id,
          "support_date" => "2020-10-29T14:30:23.000Z",
          "supporterImages" => [nil, nil]
        },
        {
          "amount" => 1200,
          "artistApproved" => false,
          "artistColor" => nil,
          "artistPageId" => second_subscription.artist_page_id,
          "artistSlug" => nil,
          "image" => nil,
          "last_post_date" => nil,
          "name" => second_subscription.artist_page.name,
          "promoteSquareImages" => [nil, nil, nil, nil, nil, nil],
          "promoteStoryImages" => [nil, nil, nil, nil, nil, nil, nil],
          "subscriptionId" => second_subscription.id,
          "support_date" => "2020-10-29T14:34:21.000Z",
          "supporterImages" => [nil, nil]
        }
      ])
    end

    it "returns ownedPages" do
      artist_page = create(:artist_page)
      artist_page.owners << user

      plan = create(:plan, artist_page: artist_page, nominal_amount: 1758, currency: "usd")
      create(
        :subscription,
        artist_page: artist_page,
        plan: plan,
        created_at: Time.new(2020, 10, 29, 14, 30, 23, "+00:00")
      )

      get url

      expect(JSON.parse(response.body)["ownedPages"]).to eq(
        [
          {
            "artistApproved" => false,
            "artistColor" => nil,
            "artistId" => artist_page.id,
            "artistSlug" => nil,
            "image" => nil,
            "instrument" => nil,
            "isStripeSetup" => false,
            "lastPayout" => nil,
            "lastPost" => nil,
            "monthlyTotal" => 1758,
            "name" => artist_page.name,
            "promoteSquareImages" => [nil, nil, nil, nil, nil, nil],
            "promoteStoryImages" => [nil, nil, nil, nil, nil, nil, nil],
            "role" => "member",
            "stripeDashboard" => nil,
            "stripeSignup" => nil,
            "supporterImages" => [nil, nil],
            "supportersCount" => 1
          }
        ]
      )
    end
  end
end
