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
#  twitter_handle       :string
#  updated_at           :datetime         not null
#  video_screenshot_url :string
#  video_url            :string
#

FactoryBot.define do
  factory :artist_page do
  end
end
