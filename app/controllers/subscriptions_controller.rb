class SubscriptionsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_subscription_scoped_to_current_user, only: %i[destroy update]

  def index
    @subscriptions = current_user.subscriptions
  end

  def create
    subscription = subscribe_stripe
    UpdateArtistOwnerStatusJob.perform_async(@current_artist_page.id)
    UserSupportedArtistEmailJob.perform_async(subscription.id)
    NewSupporterNotificationJob.perform_async(subscription.id)
    render json: subscription
  rescue Stripe::InvalidRequestError => e
    return account_restricted_error(e) if /disabled_reason/.match?(e.message)

    Raven.capture_exception(e)
    render json: { status: "error", message: e.message }
  rescue Stripe::CardError => e
    render json: { status: "error", message: e.message }
  rescue StandardError => e
    Raven.capture_exception(e)
    render json: { status: "error", message: e.message }
  end

  def destroy
    current_subscription.cancel!
    render json: :ok
  end

  def update
    plan = stripe_plan

    ActiveRecord::Base.transaction do
      current_subscription.update!(plan: plan)

      Stripe::Subscription.update(
        current_subscription.stripe_id,
        {
          plan: plan.stripe_id,
          proration_behavior: "none" # Don't prorate new price
        }, stripe_account: current_artist_page.stripe_user_id
      )
    end

    render json: :ok
  rescue Stripe::StripeError => e
    Raven.capture_exception(e)
    render json: { status: "error", message: e.message }, status: :bad_request
  end

  private

  def account_restricted_error(error)
    Raven.capture_exception(error)
    ArtistPageUnsupportableEmailJob.perform_async(current_artist_page.id, subscription_params[:amount].to_i)
    render json: {
      status: "error",
      message: "#{current_artist_page.name} needs to finalize some things before you can support them.\
      We've sent them an email to let them know!"
    }
  end

  def ensure_subscription_scoped_to_current_user
    return render_not_allowed unless current_subscription.user == current_user || current_user.admin?
  end

  def render_not_allowed
    render json: { status: "error", message: "Not allowed." }
  end

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
    stripe_application_fee_percent = StripeUtil.stripe_application_fee_percent(
      plan: plan,
      application_fee_percent: current_artist_page.application_fee_percent
    )
    Stripe::Subscription.create(
      {
        customer: artist_customer_id,
        plan: plan.stripe_id,
        expand: ["latest_invoice.payment_intent"],
        application_fee_percent: stripe_application_fee_percent
      }, stripe_account: current_artist_page.stripe_user_id
    )
  end

  def stripe_plan
    current_artist_page.plan_for_nominal_amount(Money.new(subscription_params[:amount].to_i, "usd"))
  end

  def check_customer
    # if they have a stripe ID but they're sending a token, their old card got unlinked
    # so they're entering a new card at checkout - update their Customer
    update_single_customer if current_user.stripe_customer_id.present? && params["token"].present?

    # if they don't have a stripe ID, we need to create a Customer for them
    create_platform_customer if current_user.stripe_customer_id.blank?
  end

  def subscribe_stripe
    check_customer

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
    @current_artist_page ||= if params["artist_page_id"].present?
                               ArtistPage.find(params["artist_page_id"])
                             else
                               current_subscription.artist_page
                             end
  end

  def subscription_params
    params.permit(:artist_page_id, :amount).merge(user_id: current_user.id)
  end

  def current_subscription
    Subscription.find(params.require(:id))
  end
end
