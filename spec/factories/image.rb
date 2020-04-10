# == Schema Information
#
# Table name: images
#
#  created_at     :datetime         not null
#  id             :bigint(8)        not null, primary key
#  imageable_id   :bigint(8)
#  imageable_type :string
#  public_id      :string
#  updated_at     :datetime         not null
#  url            :string
#

FactoryBot.define do
  factory :image do
    association :imageable, factory: :artist_page
    url { Faker::Internet.url }
    public_id { Faker::Alphanumeric.alpha }
  end
end
