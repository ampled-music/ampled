FactoryBot.define do
  factory :post do
    title { Faker::Books::Dune.quote }
    body { Faker::Books::Lovecraft.paragraphs([1, 2].sample).join("\n")}
    user
    artist_page
  end
end
