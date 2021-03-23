require "rails_helper"

RSpec.describe SubscriptionsController, :vcr, type: :request do
  let(:user) do
    # when recording VCR cassettes, use a real (test) customer id
    create(:user, stripe_customer_id: "cus_FfMNyx9ktbGwnx", confirmed_at: Time.current, email: "user@ampled.com")
  end
  let(:other_user) { create(:user, confirmed_at: Time.current, email: "test@ampled.com") }
  let(:artist_page) { create(:artist_page, name: "Ampledband") }
  let(:other_artist_page) { create(:artist_page, name: "Ampledband2") }
  let(:restricted_artist_page) { create(:artist_page, name: "Ampledband3") }

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

  let(:create_params_with_token) do
    {
      artist_page_id: artist_page.id,
      amount: 10_000,
      token: "tok_visa_debit"
    }
  end

  let(:update_params) do
    {
      amount: 20_000
    }
  end

  let(:other_create_params) do
    {
      artist_page_id: other_artist_page.id,
      amount: 15_000
    }
  end

  let(:restricted_create_params) do
    {
      artist_page_id: restricted_artist_page.id,
      amount: 15_000
    }
  end

  before do
    artist_page.update(stripe_user_id: existing_stripe_auth["stripe_user_id"])
    other_artist_page.update(stripe_user_id: other_existing_stripe_auth["stripe_user_id"])
    restricted_artist_page.owners << other_user
  end

  context "when pulling me.json" do
    before { get "/me.json" }
    it "contains card info" do
      expect(JSON.parse(response.body)["userInfo"]["cardInfo"]["last4"]).not_to be_empty
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

      plan = Plan.where(artist_page_id: create_params[:artist_page_id]).take
      expect(plan.nominal_amount).to eq Money.new(create_params[:amount], "usd")
    end

    it "calls email job for user supported artist" do
      allow(UserSupportedArtistEmailJob).to receive(:perform_async)

      post url, params: create_params

      subscription = user.subscriptions.active.first
      expect(UserSupportedArtistEmailJob).to have_received(:perform_async).with(subscription.id)
    end

    it "calls email job for new supporter" do
      allow(UserSupportedArtistEmailJob).to receive(:perform_async)
      allow(NewSupporterEmailJob).to receive(:perform_async)

      post url, params: create_params

      subscription = user.subscriptions.active.first
      expect(NewSupporterEmailJob).to have_received(:perform_async).with(subscription.id)
    end

    it "queues the UpdateArtistOwnerStatusJob" do
      expect { post url, params: create_params }
        .to change { UpdateArtistOwnerStatusJob.jobs.count }.by(1)

      expect(UpdateArtistOwnerStatusJob.jobs.last["args"]).to match_array([
        create_params[:artist_page_id]
      ])
    end

    context "and the user's card is declined" do
      before(:each) do
        allow(Stripe::Customer).to receive(:create).and_raise(Stripe::CardError.new("Card declined.", :card, {}))
      end
      it "returns an error" do
        post url, params: create_params

        body = JSON.parse(response.body)
        expect(response.status).to eq 200
        expect(body["status"]).to eq "error"
        expect(body["message"]).to eq "Card declined."
      end

      it "doesn't call Raven.capture_exception" do
        expect(Raven).not_to receive(:capture_exception)

        post url, params: create_params
      end
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
      sign_in user
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

    it "calls email job for user cancelling subsciption" do
      allow(UserCancelledSubscriptionEmailJob).to receive(:perform_async)

      prev_redis_url = ENV["REDIS_URL"]
      begin
        ENV["REDIS_URL"] = "temp"
        delete "/subscriptions/#{@subscription.id}"
      ensure
        ENV["REDIS_URL"] = prev_redis_url
      end

      expect(UserCancelledSubscriptionEmailJob).to have_received(:perform_async).with(@subscription.id)
    end
  end

  context "when creating a subscription for an artist who was previously supported & cancelled" do
    let(:url) { "/subscriptions/" }

    before(:each) do
      sign_in user
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

  context "when creating a subscription as a user with no card on file" do
    let(:url) { "/subscriptions" }
    before(:each) do
      sign_out user
      sign_in other_user
    end

    it "returns 200" do
      post url, params: create_params_with_token

      expect(response.status).to eq 200
    end

    it "saves the subscription in the database" do
      post url, params: create_params_with_token

      expect(other_user.subscriptions.active.count).to eq 1
    end

    it "creates the subscription in stripe" do
      post url, params: create_params_with_token
      subscription = other_user.subscriptions.active.first
      customer = Stripe::Customer.retrieve(subscription.stripe_customer_id, stripe_account: artist_page.stripe_user_id)
      actual_amount = ((create_params[:amount] + 30) / 0.971).round

      expect(customer.subscriptions.first.plan.amount).to eq actual_amount
    end
  end

  context "when attempting to create a subscription for an account with no stripe connection" do
    let(:url) { "/subscriptions/" }
    before(:each) do
      sign_in user
    end

    it "returns 200" do
      post url, params: restricted_create_params

      expect(response.status).to eq 200
    end

    it "returns error text" do
      post url, params: restricted_create_params

      expect(JSON.parse(response.body)["message"]).to match "Must authenticate as a connected account"
    end

    it "doesn't saves the subscription in the database" do
      post url, params: restricted_create_params

      expect(user.subscriptions.active.count).to eq 0
    end
  end

  context "when attempting to create a subscription for a restricted account" do
    let(:url) { "/subscriptions/" }
    before do
      # Using a hardcoded account that is left in restricted mode.
      restricted_artist_page.update(stripe_user_id: "acct_1GdkndFObJENiB3b")
    end
    before(:each) do
      sign_in user
    end

    it "returns 200" do
      post url, params: restricted_create_params

      expect(response.status).to eq 200
    end

    it "returns error text" do
      post url, params: restricted_create_params

      expect(JSON.parse(response.body)["message"]).to match "needs to finalize some things"
    end

    it "doesn't saves the subscription in the database" do
      post url, params: restricted_create_params

      expect(user.subscriptions.active.count).to eq 0
    end

    it "calls email job for unsupportable artist" do
      allow(ArtistPageUnsupportableEmailJob).to receive(:perform_async)

      prev_redis_url = ENV["REDIS_URL"]
      begin
        ENV["REDIS_URL"] = "temp"
        post url, params: restricted_create_params
      ensure
        ENV["REDIS_URL"] = prev_redis_url
      end

      expect(ArtistPageUnsupportableEmailJob).to have_received(:perform_async).with(restricted_artist_page.id,
                                                                                    restricted_create_params[:amount])
    end
  end

  context "when updating a subscription amount" do
    before(:each) do
      sign_in user
      post "/subscriptions", params: create_params
      @subscription = user.subscriptions.active.first
    end

    it "returns 200 when successful" do
      put "/subscriptions/#{@subscription.id}", params: update_params

      expect(response.status).to eq 200
    end

    it "returns 200 when amount is under $3.00" do
      put "/subscriptions/#{@subscription.id}", params: update_params.merge(amount: 3_00)

      expect(response.status).to eq 200
    end

    it "creates a new plan if no plan exists for that price" do
      put "/subscriptions/#{@subscription.id}", params: update_params

      plan = @subscription.reload.plan
      expect(plan.artist_page).to eq artist_page
      expect(plan.nominal_amount).to eq Money.new(20_000, "usd")
    end

    it "uses an existing plan if a plan exists for that price" do
      plan = @subscription.artist_page.plan_for_nominal_amount(Money.new(20_000, "usd"))

      put "/subscriptions/#{@subscription.id}", params: update_params

      expect(@subscription.reload.plan).to eq plan
    end

    it "updates the plan on Stripe" do
      @subscription.artist_page.plan_for_nominal_amount(Money.new(20_000, "usd"))

      put "/subscriptions/#{@subscription.id}", params: update_params

      expect(Stripe::Subscription.retrieve(@subscription.stripe_id, stripe_account: artist_page.stripe_user_id).plan.id)
        .to eq @subscription.reload.plan.stripe_id
    end

    it "doesn't update for another user" do
      sign_out user
      sign_in other_user

      put "/subscriptions/#{@subscription.id}", params: update_params

      expect(JSON.parse(response.body)["message"]).to eq("Not allowed.")
    end

    it "doesn't update for an unauthenticated user" do
      sign_out user

      put "/subscriptions/#{@subscription.id}", params: update_params

      expect(response.body).to eq("You need to sign in or sign up before continuing.")
    end
  end
end
