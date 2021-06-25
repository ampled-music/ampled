# == Schema Information
#
# Table name: artist_pages
#
#  accent_color         :string
#  banner_image_url     :string
#  bio                  :string
#  created_at           :datetime         not null
#  id                   :bigint(8)        not null, primary key
#  instagram_handle     :string
#  location             :string
#  name                 :string
#  state_token          :string
#  stripe_access_token  :string
#  stripe_product_id    :string
#  stripe_user_id       :string
#  twitter_handle       :string
#  updated_at           :datetime         not null
#  video_url            :string
#

FactoryBot.define do
  factory :artist_page do
    name { Faker::Music::RockBand.name }
    application_fee_percent { 7 }

    trait :with_image do
      images { [build(:image)] }
    end
  end
end
