class MeController < ApplicationController
  def index
    @owned_pages = current_user&.owned_pages
    @owned = current_user&.owned_pages&.map { |page| OpenStruct.new(id: page.id, role: "owner") }
    @supported = current_user&.supported_artists&.map { |page| OpenStruct.new(id: page.id, role: "supporter") }
    @subscriptions = current_user&.subscriptions&.active
    @stripe_info = stripe_card_info
  end

  def stripe_card_info
    return unless current_user.stripe_customer_id.present?
    if current_user.card_last4
      { brand: current_user.card_brand, exp_month: current_user.card_exp_month,
        exp_year: current_user.card_exp_year, last4: current_user.card_last4 }
    else
      card = Stripe::Customer.retrieve(current_user.stripe_customer_id).sources.data[0]
      current_user.update(card_brand: card.brand, card_exp_month: card.exp_month,
                          card_exp_year: card.exp_year, card_last4: card.last4)
      { brand: card.brand, exp_month: card.exp_month,
        exp_year: card.exp_year, last4: card.last4 }
    end
  end
end
