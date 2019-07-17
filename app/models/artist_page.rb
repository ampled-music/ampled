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

  def active_subscribers
    subscribers.merge(Subscription.active)
  end

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

  def create_plan(amount)
    stripe_plan = Stripe::Plan.create(
      {
        product: stripe_product.id,
        nickname: "Ampled Support $5",
        interval: "month",
        currency: "usd",
        amount: amount
      }, stripe_account: stripe_user_id
    )
    plan = Plan.new(stripe_id: stripe_plan.id, amount: amount)
    plans << plan
    plan
  end

  def plan_for_amount(amount)
    plans.find_by(amount: amount) || create_plan(amount)
  end

  def stripe_dashboard_url
    return "" if stripe_user_id.blank?

    stripe_account.login_links.create["url"]
  end

  def stripe_account
    Stripe::Account.retrieve(stripe_user_id)
  end

  def stripe_product
    create_product if stripe_product_id.nil?

    @stripe_product ||= Stripe::Product.retrieve(stripe_product_id, stripe_account: stripe_user_id)
  end

  def subscriber_count
    subscribers.count
  end

  def monthly_total
    subscriptions.active.includes(:plan).reduce(0) do |sum, subscription|
      sum + subscription.plan.amount
    end
  end

  def last_post_date
    posts.order(created_at: :desc).first&.created_at
  end

  def last_payout
    return nil if stripe_user_id.blank?

    response = Stripe::Payout.list({ limit: 1 }, stripe_account: stripe_user_id)
    payout = response.data[0]
    return nil if payout.blank?

    DateTime.strptime(payout["arrival_date"].to_s, "%s")
  end

  def most_recent_supporter
    subscriptions.order(created_at: :desc).first&.user
  end

  private

  def create_product
    product = Stripe::Product.create(
      {
        name: "Ampled Support",
        type: "service"
      }, stripe_account: stripe_user_id
    )
    update(stripe_product_id: product.id)
  end
end
