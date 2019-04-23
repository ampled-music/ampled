class StripeController < ApplicationController
  layout "empty"

  def callback
    # This is the callback hit after the artist signs up for a stripe account
    stripe_account = authorize_stripe_account
    ap = ArtistPage.find_by(state_token: params[:state])
    ap.update(stripe_user_id: stripe_account["stripe_user_id"])
    setup_account(ap)
    redirect_to "/stripe"
  end

  def save_card
    # Create a Platform customer
    customer = Stripe::Customer.create(
      description: current_user.email,
      source: params["stripeToken"], # obtained with Stripe.js
    )
    current_user.update(customer_id: customer.id)
    redirect_to "/stripe"
  end

  def add_credit_card
  end

  def subscribe
    ap_id = params["artist_page_id"]
    artist_page = ArtistPage.find(ap_id)

    plan = artist_page.plans.first
    token = create_token(current_user, artist_page)
    customer = create_customer(token, current_user, artist_page)
    stripe_subscription = create_stripe_subscription(customer.id, artist_page, plan)

    @subscription = Subscription.create(user: current_user, artist_page: artist_page, plan_id: plan.id)
    redirect_to "/stripe"
  end

  private

  def create_stripe_subscription(customer_id, artist_page, plan)
    Stripe::Subscription.create(
      {
        customer: customer_id,
        plan: plan.stripe_id,
        expand: ["latest_invoice.payment_intent"],
        application_fee_percent: 15,
      }, stripe_account: artist_page.stripe_user_id
    )
  end

  def setup_account(artist_page)
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

  def current_user
    User.find_by(email: "benton.anderson@gmail.com")
  end

  def create_token(user, artist_page)
    Stripe::Token.create(
      { customer: user.stripe_customer_id },
      stripe_account: artist_page.stripe_user_id
    )
  end

  def create_customer(token, user, artist_page)
    # Using the token generated from our platform customer, create a customer for the AP
    Stripe::Customer.create(
      {
        description: "#{user.email} for #{artist_page.name}",
        source: token.id
      },
      stripe_account: artist_page.stripe_user_id
    )
  end

  def authorize_stripe_account
    connection.post("https://connect.stripe.com/oauth/token",
                    client_secret: "sk_test_WpL6hAXT7brfG79UaViblroq00X4X2uvkS",
    code: params[:code],
    grant_type: "authorization_code").body
  end

  def connection
    @connection ||= Faraday.new do |faraday|
      faraday.request :json
      faraday.response :json
      faraday.adapter Faraday.default_adapter
    end
  end
end
