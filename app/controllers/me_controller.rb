class MeController < ApplicationController
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  def index
    sync_card_info_with_stripe if current_user && current_user.card_last4.blank?

    @owned_pages = current_user&.page_ownerships&.map do |ownership|
      OpenStruct.new(page: ownership.artist_page, role: ownership.role, instrument: ownership.instrument)
    end
    @owned = current_user&.page_ownerships&.map do |ownership|
      OpenStruct.new(id: ownership.artist_page.id, role: ownership.role)
    end
    @supported = current_user&.supported_artists&.map { |page| OpenStruct.new(id: page.id, role: "supporter") }
    @subscriptions = current_user&.subscriptions&.active
    @stripe_info = serialize_current_user_card
  end
  # rubocop:enable Metrics/PerceivedComplexity
  # rubocop:enable Metrics/CyclomaticComplexity

  def update_card
    stripe_customer = Stripe::Customer.update(current_user.stripe_customer_id, source: params["token"])
    sync_card_info_with_stripe(stripe_customer)

    current_user.subscriptions.includes(:artist_page).each do |subscription|
      update_token_for_subscription(subscription)
    end

    render json: current_user
  rescue Stripe::StripeError => e
    Raven.capture_exception(e)
    render json: { status: "error", message: e.message }, status: :bad_request
  end

  private

  def update_token_for_subscription(subscription)
    artist_page = subscription.artist_page
    token = Stripe::Token.create(
      { customer: current_user.stripe_customer_id },
      stripe_account: artist_page.stripe_user_id
    )

    Stripe::Customer.update(
      subscription.stripe_customer_id,
      { source: token.id },
      stripe_account: artist_page.stripe_user_id
    )
  end

  def sync_card_info_with_stripe(stripe_customer = nil)
    return if current_user.stripe_customer_id.blank?

    stripe_customer = fetch_current_user_stripe_customer if stripe_customer.nil?
    stripe_card = stripe_customer.sources.data[0]
    save_stripe_card_for_current_user(stripe_card)
  end

  def fetch_current_user_stripe_customer
    Stripe::Customer.retrieve(current_user.stripe_customer_id)
  end

  def save_stripe_card_for_current_user(stripe_card)
    current_user.update(
      card_brand: stripe_card&.brand,
      card_exp_month: stripe_card&.exp_month,
      card_exp_year: stripe_card&.exp_year,
      card_last4: stripe_card&.last4,
      card_is_valid: stripe_card.present? ? true : nil
    )
  end

  def serialize_current_user_card
    return if current_user&.card_last4.blank?

    {
      brand: current_user.card_brand,
      exp_month: current_user.card_exp_month,
      exp_year: current_user.card_exp_year,
      last4: current_user.card_last4,
      is_valid: current_user.card_is_valid
    }
  end
end
