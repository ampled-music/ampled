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

  has_many :plans, dependent: :destroy

  def stripe_state_token
    return state_token if state_token.present?

    update(state_token: SecureRandom.uuid)
    state_token
  end

  def stripe_signup_url
    return "" if stripe_user_id.present?

    base = "https://connect.stripe.com/express/oauth/authorize"
    params = {
      redirect_uri: "#{ENV["REACT_APP_API_URL"]}stripe_oauth_callback",
      client_id: "ca_Eowu0ycKNxFo46f8hqlCNCpt4w26bxer",
      state: stripe_state_token,
      "suggested_capabilities[]" => "card_payments"
    }.to_query
    "#{base}?#{params}"
  end

  def stripe_dashboard_url
    return "" if stripe_user_id.blank?

    Stripe::Account.retrieve(stripe_user_id).login_links.create["url"]
  end

  def last_post_date
    posts.order(created_at: :desc).first&.created_at
  end

  def most_recent_supporter
    subscriptions.order(created_at: :desc).first&.user_id
  end

  def last_post_date
    posts.order(created_at: :desc).first&.created_at
  end
end
