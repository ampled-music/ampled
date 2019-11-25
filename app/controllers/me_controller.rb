class MeController < ApplicationController
  def index
    @owned_pages = current_user&.owned_pages
    @owned = current_user&.owned_pages&.map { |page| OpenStruct.new(id: page.id, role: "owner") }
    @supported = current_user&.supported_artists&.map { |page| OpenStruct.new(id: page.id, role: "supporter") }
    @subscriptions = current_user&.subscriptions&.active
    @stripeInfo = current_user.stripe_customer_id? && Stripe::Customer.retrieve(current_user.stripe_customer_id).sources.data[0]
  end
end
