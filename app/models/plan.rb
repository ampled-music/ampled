# == Schema Information
#
# Table name: plans
#
#  artist_page_id :bigint(8)        not null
#  charge_amount  :integer
#  currency       :string           default("usd"), not null
#  id             :bigint(8)        not null, primary key
#  nominal_amount :integer          not null
#  stripe_id      :string           not null
#
# Indexes
#
#  index_plans_on_artist_page_id  (artist_page_id)
#
# Foreign Keys
#
#  fk_rails_...  (artist_page_id => artist_pages.id)

# Read more about Stripe currency support: https://stripe.com/docs/currencies

class Plan < ApplicationRecord
  include MoneyColumn

  belongs_to :artist_page

  money_column :nominal_amount, :charge_amount, currency_column: :currency
end
