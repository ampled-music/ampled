# == Schema Information
#
# Table name: plans
#
#  artist_page_id :integer          not null
#  charge_amount  :integer          not null
#  currency       :string           default("usd"), not null
#  id             :integer          not null, primary key
#  nominal_amount :integer          not null
#  stripe_id      :string           not null
#
# Indexes
#
#  index_plans_on_artist_page_id  (artist_page_id)
#

# Read more about Stripe currency support: https://stripe.com/docs/currencies

class Plan < ApplicationRecord
  include MoneyColumn

  belongs_to :artist_page

  money_column :nominal_amount, :charge_amount, currency_column: :currency
end
