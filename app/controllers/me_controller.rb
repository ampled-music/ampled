class MeController < ApplicationController
  def index
    @owned_pages = current_user&.owned_pages
    @owned = current_user&.page_ownerships&.map { |ownership| OpenStruct.new(id: ownership.artist_page.id, role: ownership.role) }
    @supported = current_user&.supported_artists&.map { |page| OpenStruct.new(id: page.id, role: "supporter") }
    @subscriptions = current_user&.subscriptions&.active
    @stripe_info = stripe_card_info
  end

  def stripe_card_info
    return unless current_user
    return if current_user&.stripe_customer_id.blank?

    if current_user.card_last4.present?
      { brand: current_user.card_brand, exp_month: current_user.card_exp_month,
        exp_year: current_user.card_exp_year, last4: current_user.card_last4,
        is_valid: current_user.card_is_valid }
    else
      card = Stripe::Customer.retrieve(current_user.stripe_customer_id).sources.data[0]
      current_user.update(card_brand: card.brand, card_exp_month: card.exp_month,
                          card_exp_year: card.exp_year, card_last4: card.last4,
                          card_is_valid: true)
      { brand: card.brand, exp_month: card.exp_month,
        exp_year: card.exp_year, last4: card.last4,
        is_valid: true }
    end
  end
end
