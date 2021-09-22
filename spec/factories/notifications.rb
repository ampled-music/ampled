FactoryBot.define do
  factory :notification do
    link { "MyString" }
    text { "MyText" }
    is_unread { false }
    user { nil }
  end
end
