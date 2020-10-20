FactoryBot.define do
  factory :plan do
    artist_page
    nominal_amount { Random.rand(50_000) }
    charge_amount { StripeUtil.charge_amount_for_nominal_amount(Money.new(nominal_amount, "usd")).fractional }
    stripe_id { Faker::Alphanumeric.alphanumeric(10) }
  end
end
