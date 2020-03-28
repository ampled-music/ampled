class SubscriptionsController < ApplicationController
  before_action :authenticate_user!
  before_action :allow_destroy, only: %i[destroy]

  def index
    @subscriptions = current_user.subscriptions
  end

  def show
    # BA - should we delete this?
  end

  def new
    # BA - should we delete this?
    @artist_page = ArtistPage.new
  end

  def edit
    # BA - should we delete this?
  end

  def create
    subscription = subscribe_stripe
    UserSupportedArtistEmailJob.perform_async(subscription.id) unless ENV["REDIS_URL"].nil?
    NewSupporterEmailJob.perform_async(subscription.id) unless ENV["REDIS_URL"].nil?
    render json: subscription
  rescue StandardError => e
    Raven.capture_exception(e)
    render json: { status: "error", message: e.message }
  end

  def update
    # if @subscription.update(subscription_params)
    #  redirect_to @artist_page, notice: "Artist page was successfully updated."
    # else
    #  render :edit
    # end
  end

  def allow_destroy
    return render_not_allowed unless current_subscription.user == current_user || current_user.admin?
  end

  def destroy
    current_subscription.cancel!
    # redirect_to artist_pages_url, notice: "Artist page was successfully destroyed."
    render json: :ok
  end

  def render_not_allowed
    render json: { status: "error", message: "Not allowed." }
  end

  def update_platform_customer
    # Update platform customer
    begin
      customer = update_single_customer
    rescue Stripe::CardError => e
      Raven.capture_exception(e)
      return render json: { status: "error", message: e.message }, status: :bad_request
    end
    card = customer.sources.data[0]
    current_user.update(card_brand: card.brand, card_exp_month: card.exp_month,
                        card_exp_year: card.exp_year, card_last4: card.last4,
                        card_is_valid: true)

    # Update artist customer(s)
    @subscriptions = current_user&.subscriptions
    @subscriptions.map do |sub|
      customer_id = sub.stripe_customer_id
      ap_stripe_id = sub.artist_page.stripe_user_id
      token = Stripe::Token.create(
        { customer: current_user.stripe_customer_id },
        stripe_account: ap_stripe_id
      )
      Stripe::Customer.update(customer_id, { source: token.id }, stripe_account: ap_stripe_id)
    rescue StandardError => e
      Raven.capture_exception(e)
      render json: { status: "error", message: e.message }, status: :bad_request
    end

    # Send back update
    render json: current_user
  end

  private

  def update_single_customer
    Stripe::Customer.update(current_user.stripe_customer_id, source: params["token"])
  end

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
        application_fee_percent: 0
      }, stripe_account: current_artist_page.stripe_user_id
    )
  end

  def stripe_plan
    current_artist_page.plan_for_nominal_amount(subscription_params[:amount].to_i)
  end

  def subscribe_stripe
    create_platform_customer if current_user.stripe_customer_id.blank?

    plan = stripe_plan
    token = create_token
    artist_customer = create_artist_customer(token)

    begin
      stripe_subscription = create_stripe_subscription(plan, artist_customer.id)
    rescue StandardError => e
      Raven.capture_exception(e)
      # if saved card, flag as invalid
      current_user.update(card_is_valid: false) if current_user.card_last4.present?
      raise e
    end
    subscription = Subscription.create!(
      user: current_user,
      artist_page: current_artist_page,
      plan_id: plan.id,
      stripe_customer_id: artist_customer.id,
      stripe_id: stripe_subscription.id,
      status: :active
    )
    card = Stripe::Customer.retrieve(current_user.stripe_customer_id).sources.data[0]
    current_user.update(card_brand: card.brand, card_exp_month: card.exp_month,
                        card_exp_year: card.exp_year, card_last4: card.last4,
                        card_is_valid: true)
    subscription
  end

  def create_platform_customer
    customer = Stripe::Customer.create(
      description: current_user.email,
      source: params["token"] # obtained with Stripe.js
    )
    current_user.update(stripe_customer_id: customer.id)
  end

  def current_artist_page
    @current_artist_page ||= ArtistPage.find(params["artist_page_id"])
  end

  def subscription_params
    params.permit(:artist_page_id, :amount).merge(user_id: current_user.id)
  end

  def current_subscription
    Subscription.find(params.require(:id))
  end
end
