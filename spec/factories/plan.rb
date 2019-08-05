FactoryBot.define do
  factory :plan do
    artist_page
    nominal_amount { Random.rand(50_000) }
    stripe_id { Faker::Alphanumeric.alphanumeric(10) }
  end
end
