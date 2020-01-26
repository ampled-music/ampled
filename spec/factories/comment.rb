FactoryBot.define do
  factory :comment do
    post
    user
    text { Faker::Books::Lovecraft.paragraphs([1, 2].sample).join("\n") }
  end
end
