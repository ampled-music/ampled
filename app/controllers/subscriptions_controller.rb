class SubscriptionsController < ApplicationController
  # before_action :set_artist_page, only: %i[show edit update destroy]

  def index
    @subscriptions = current_user.subscriptions
  end

  def show
  end

  def new
    @artist_page = ArtistPage.new
  end

  def edit
  end

  def create
    subscription = subscribe_stripe
    render json: subscription
  end

  def update
    # if @subscription.update(subscription_params)
    #  redirect_to @artist_page, notice: "Artist page was successfully updated."
    # else
    #  render :edit
    # end
  end

  def destroy
    # @.destroy
    # redirect_to artist_pages_url, notice: "Artist page was successfully destroyed."
  end

  private

  def create_token
    Stripe::Token.create(
      { customer: current_user.stripe_customer_id },
      stripe_account: current_artist_page.stripe_user_id
    )
  end

  def create_artist_customer(token)
    # Using the token generated from our platform customer, create a customer for the AP
    Stripe::Customer.create(
      {
        description: "#{current_user.email} for #{current_artist_page.name}",
        source: token.id
      },
      stripe_account: current_artist_page.stripe_user_id
    )
  end

  def create_stripe_subscription(plan, artist_customer_id)
    Stripe::Subscription.create(
      {
        customer: artist_customer_id,
        plan: plan.stripe_id,
        expand: ["latest_invoice.payment_intent"],
        application_fee_percent: 15
      }, stripe_account: current_artist_page.stripe_user_id
    )
  end

  def subscribe_stripe
    create_platform_customer if current_user.stripe_customer_id.blank?

    plan = current_artist_page.plans.first
    token = create_token
    artist_customer = create_artist_customer(token)

    create_stripe_subscription(plan, artist_customer.id)

    Subscription.create!(user: current_user, artist_page: current_artist_page, plan_id: plan.id)
  end

  def create_platform_customer
    customer = Stripe::Customer.create(
      description: current_user.email,
      source: params["token"], # obtained with Stripe.js
    )
    current_user.update(stripe_customer_id: customer.id)
  end

  def current_artist_page
    @current_artist_page ||= ArtistPage.find(params["artist_page_id"])
  end

  def subscription_params
    params.require(:subscription).permit(:artist_page_id).merge(user_id: current_user.id)
  end
end
