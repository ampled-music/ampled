require "rails_helper"

RSpec.describe MeController, :vcr, type: :request do
  describe "#index" do
    let(:image) { create(:image) }
    let(:user) { create(:user, image: image) }
    let(:url) { "/me.json" }

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
            "approved" => false,
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

    context "when the user has credit card info" do
      before(:each) do
        user.update!(
          card_brand: "Visa",
          card_exp_month: "10",
          card_exp_year: "21",
          card_is_valid: true,
          card_last4: "1234"
        )
      end

      it "populates userInfo.cardInfo in the response" do
        get url

        expect(JSON.parse(response.body)["userInfo"]["cardInfo"]).to eq(
          {
            "brand" => "Visa",
            "exp_month" => "10",
            "exp_year" => "21",
            "is_valid" => true,
            "last4" => "1234"
          }
        )
      end

      it "does not try to pull card info from Stripe" do
        expect(Stripe::Customer).not_to receive(:retrieve)

        get url
      end
    end

    context "when the user does not have credit card info" do
      context "and the user does not have a stripe_customer_id" do
        it "sets userInfo.creditInfo to nil in the response" do
          get url

          expect(JSON.parse(response.body)["userInfo"]["cardInfo"]).to be_nil
        end

        it "does not try to pull card info from Stripe" do
          expect(Stripe::Customer).not_to receive(:retrieve)

          get url
        end
      end

      context "and the user has a credit card on Stripe" do
        let(:user) { StripeIntegrationTestHelper.create_user_with_stripe_customer }

        it "updates the user's credit card info" do
          get url

          expect(user.card_brand).to eq "Visa"
          expect(user.card_exp_month).to eq "3"
          expect(user.card_exp_year).to eq "2022"
          expect(user.card_is_valid).to eq true
          expect(user.card_last4).to eq "4242"
        end

        it "populates userInfo.creditInfo in the response" do
          get url

          expect(JSON.parse(response.body)["userInfo"]["cardInfo"]).to eq(
            {
              "brand" => "Visa",
              "exp_month" => "3",
              "exp_year" => "2022",
              "is_valid" => true,
              "last4" => "4242"
            }
          )
        end
      end

      context "and the user does not have a credit card on Stripe" do
        let(:user) { StripeIntegrationTestHelper.create_user_with_stripe_customer(stripe_token: nil) }

        it "sets userInfo.creditInfo to nil in the response" do
          get url

          expect(JSON.parse(response.body)["userInfo"]["cardInfo"]).to be_nil
        end
      end
    end
  end

  describe "#update_card" do
    let(:url) { "/me/update_card.json" }
    let!(:user) { StripeIntegrationTestHelper.create_user_with_stripe_customer(stripe_token: "tok_visa_debit") }

    before do
      sign_in user
    end

    context "when the user provides a valid stripe token" do
      it "updates the user's credit card details" do
        put url, params: { token: "tok_visa" }

        expect(user.reload.card_brand).to eq "Visa"
        expect(user.card_exp_month).to eq "3"
        expect(user.card_exp_year).to eq "2022"
        expect(user.card_is_valid).to eq true
        expect(user.card_last4).to eq "4242"
      end

      it "updates the Stripe customer for all subscribed artist page's connect accounts" do
        subscriptions = Array.new(2) do
          StripeIntegrationTestHelper.create_subscription_with_stripe_subscription(
            stripe_token: "tok_visa_debit",
            user: user
          )
        end

        put url, params: { token: "tok_visa" }

        subscriptions.each do |subscription|
          stripe_customer_card = Stripe::Customer.retrieve(
            subscription.stripe_customer_id,
            stripe_account: subscription.artist_page.stripe_user_id
          ).sources.data[0]

          expect(stripe_customer_card.brand).to eq "Visa"
          expect(stripe_customer_card.exp_month).to eq 3
          expect(stripe_customer_card.exp_year).to eq 2022
          expect(stripe_customer_card.last4).to eq "4242"
        end
      end

      it "responds with the serialized user" do
        put url, params: { token: "tok_visa" }

        expect(JSON.parse(response.body)["id"]).to eq user.id
      end
    end

    context "when the user provides an invalid stripe token" do
      it "responds with an error" do
        put url, params: { token: "tok_kittehcard" }

        parsed_response = JSON.parse(response.body)

        expect(parsed_response["status"]).to eq "error"
        expect(parsed_response["message"]).to eq "No such token: 'tok_kittehcard'"
      end
    end
  end
end
