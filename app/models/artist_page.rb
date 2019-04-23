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
#  video_screenshot_url :string
#  video_url            :string
#

class ArtistPage < ApplicationRecord
  has_many :page_ownerships, dependent: :destroy
  has_many :owners, through: :page_ownerships, source: :user

  has_many :posts, dependent: :destroy

  has_many :images, dependent: :destroy

  has_many :subscriptions, dependent: :destroy
  has_many :subscribers, through: :subscriptions, source: :user

  has_many :plans

  def stripe_state_token
    return state_token if state_token.present?

    update(state_token: SecureRandom.uuid)
    state_token
  end
end
