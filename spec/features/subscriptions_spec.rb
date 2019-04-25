require "rails_helper"

RSpec.describe SubscriptionsController, :vcr, type: :request  do
  
  let(:user) do 
    create(:user, stripe_customer_id: "cus_Evgqn1glWV1erN", confirmed_at: Time.now)
  end
  let(:artist_page) { create(:artist_page) }

  let(:existing_stripe_auth){ JSON.parse(File.read('stripe_account_stub.json')) }

  before(:each) do
    sign_in user
  end

  let(:create_params) do
    {
      artist_page_id: artist_page.id
    }
  end

  before do
    artist_page.update(stripe_user_id: existing_stripe_auth["stripe_user_id"])

    product = Stripe::Product.create(
      {
        name: "Ampled Support",
        type: "service"
      }, stripe_account: artist_page.stripe_user_id
    )

    artist_page.update(stripe_product_id: product.id)

    amount = 5 * 100
    plan = Stripe::Plan.create(
      {
        product: product.id,
        nickname: "Ampled Support $5",
        interval: "month",
        currency: "usd",
        amount: amount
      }, stripe_account: artist_page.stripe_user_id
    )

    artist_page.plans << Plan.new(stripe_id: plan.id, amount: amount)
  end

  context "when creating a subscription" do

    let(:url) { "/subscriptions/" }

    it "returns 200" do
      post url, params: create_params

      expect(response.status).to eq 200
    end

    it "saves the subscription in the database" do
      post url, params: create_params

      expect(Subscription.count).to eq 1
    end

    it "creates the subscription in stripe" do
      post url, params: create_params
      subscription = user.subscriptions.first
      customer = Stripe::Customer.retrieve(subscription.stripe_customer_id, stripe_account: artist_page.stripe_user_id)
      expect(customer.subscriptions.count).to eq 1
    end

  end

  context "when cancelling a subscription" do

    before(:each) do
      post '/subscriptions', params: create_params
      @subscription = user.subscriptions.first
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
  end

end
