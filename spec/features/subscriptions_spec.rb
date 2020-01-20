require "rails_helper"

RSpec.describe SubscriptionsController, :vcr, type: :request do
  let(:user) do
    # when recording VCR cassettes, use a real (test) customer id
    create(:user, stripe_customer_id: "cus_FfMNyx9ktbGwnx", confirmed_at: Time.current)
  end
  let(:other_user) { create(:user) }
  let(:artist_page) { create(:artist_page) }
  let(:other_artist_page) { create(:artist_page) }

  let(:existing_stripe_auth) { JSON.parse(File.read("stripe_account_stub.json")) }
  let(:other_existing_stripe_auth) { JSON.parse(File.read("other_stripe_account_stub.json")) }

  before(:each) do
    sign_in user
  end

  let(:create_params) do
    {
      artist_page_id: artist_page.id,
      amount: 10_000
    }
  end

  let(:other_create_params) do
    {
      artist_page_id: other_artist_page.id,
      amount: 15_000
    }
  end

  before do
    artist_page.update(stripe_user_id: existing_stripe_auth["stripe_user_id"])
    other_artist_page.update(stripe_user_id: other_existing_stripe_auth["stripe_user_id"])
  end

  context "when pulling me.json" do
    before { get "/me.json" }
    it "contains card info" do
      expect(JSON.parse(response.body)["userInfo"]["cardInfo"]["last4"]).not_to be_empty
    end
  end

  context "when updating card on file" do
    before do
      put "/me/updatecard.json", params: { token: "tok_visa" }
    end

    it "returns updated card info" do
      expect(JSON.parse(response.body)["card_last4"]).not_to be_empty
    end
  end

  context "when creating a subscription" do
    let(:url) { "/subscriptions/" }

    it "returns 200" do
      post url, params: create_params

      expect(response.status).to eq 200
    end

    it "saves the subscription in the database" do
      post url, params: create_params

      expect(user.subscriptions.active.count).to eq 1
    end

    it "creates the subscription in stripe" do
      post url, params: create_params
      subscription = user.subscriptions.active.first
      customer = Stripe::Customer.retrieve(subscription.stripe_customer_id, stripe_account: artist_page.stripe_user_id)
      actual_amount = ((create_params[:amount] + 30) / 0.971).round

      expect(customer.subscriptions.first.plan.amount).to eq actual_amount
    end

    it "creates a local plan with the given nominal amount" do
      post url, params: create_params
      expect(Plan.first.nominal_amount).to eq create_params[:amount]
    end
  end

  context "when creating multiple subscriptions" do
    let(:url) { "/subscriptions/" }

    it "saves the subscriptions in the db" do
      post url, params: create_params
      post url, params: other_create_params

      expect(user.subscriptions.active.count).to eq 2
    end

    it "creates the subscriptions in stripe" do
      post url, params: create_params
      post url, params: other_create_params

      subscriptions = user.subscriptions.active
      stripe_subs = subscriptions.map { |s|
        Stripe::Customer.retrieve(s.stripe_customer_id, stripe_account: s.artist_page.stripe_user_id).subscriptions
      }.flatten

      expect(stripe_subs.count).to eq 2
    end
  end

  context "when cancelling a subscription" do
    before(:each) do
      post "/subscriptions", params: create_params
      @subscription = user.subscriptions.active.first
    end

    it "returns 200" do
      delete "/subscriptions/#{@subscription.id}"

      expect(response.status).to eq 200
    end

    it "cancels the subscription" do
      delete "/subscriptions/#{@subscription.id}"

      expect(@subscription.reload.status).to eq "cancelled"
    end

    it "cancels the stripe subscription" do
      delete "/subscriptions/#{@subscription.id}"

      cancelled_sub = Stripe::Subscription.retrieve(@subscription.stripe_id, stripe_account: artist_page.stripe_user_id)
      expect(cancelled_sub.status).to eq("canceled")
    end

    it "doesn't cancel for another user" do
      sign_out user
      sign_in other_user

      delete "/subscriptions/#{@subscription.id}"

      expect(JSON.parse(response.body)["message"]).to eq("Not allowed.")
    end

    it "doesn't cancel for unauthenticated user" do
      sign_out user

      delete "/subscriptions/#{@subscription.id}"

      expect(response.body).to eq("You need to sign in or sign up before continuing.")
    end
  end

  context "when creating a subscription for an artist who was previously supported & cancelled" do
    let(:url) { "/subscriptions/" }

    before(:each) do
      post "/subscriptions", params: create_params
      user.subscriptions.active.first.cancel!
    end

    it "returns 200" do
      post url, params: create_params

      expect(response.status).to eq 200
    end

    it "creates a new active subscription" do
      post url, params: create_params

      expect(user.subscriptions.active.count).to eq 1
    end

    it "creates the subscription in stripe" do
      post url, params: create_params
      subscription = user.subscriptions.active.first

      customer = Stripe::Customer.retrieve(subscription.stripe_customer_id, stripe_account: artist_page.stripe_user_id)
      expect(customer.subscriptions.count).to eq 1
    end
  end
end
