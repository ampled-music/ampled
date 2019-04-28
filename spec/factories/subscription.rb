FactoryBot.define do
  factory :subscription do
    artist_page
    plan { create(:plan, artist_page: artist_page) }
    user
  end
end
