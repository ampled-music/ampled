# == Schema Information
#
# Table name: artist_pages
#
#  accent_color         :string
#  approved             :boolean          default(FALSE)
#  bandcamp_handle      :string
#  banner_image_url     :string
#  bio                  :string
#  created_at           :datetime         not null
#  external_handle      :string
#  featured             :boolean          default(FALSE)
#  hide_members         :boolean          default(FALSE)
#  id                   :bigint(8)        not null, primary key
#  instagram_handle     :string
#  location             :string
#  name                 :string
#  slug                 :string
#  state_token          :string
#  stripe_access_token  :string
#  stripe_product_id    :string
#  stripe_user_id       :string
#  twitter_handle       :string
#  updated_at           :datetime         not null
#  verb_plural          :boolean          default(FALSE)
#  video_screenshot_url :string
#  video_url            :string
#  youtube_handle       :string
#
# Indexes
#
#  index_artist_pages_on_slug  (slug) UNIQUE
#

class ArtistPage < ApplicationRecord
  has_many :page_ownerships, dependent: :destroy
  has_many :owners, through: :page_ownerships, source: :user

  has_many :posts, dependent: :destroy

  has_many :images, as: :imageable, dependent: :destroy

  has_many :subscriptions, dependent: :destroy
  has_many :subscribers, through: :subscriptions, source: :user

  has_many :plans, dependent: :destroy

  accepts_nested_attributes_for :images

  validate :sluggy_slug

  before_save :set_screenshot

  before_save :check_approved

  scope :approved, -> { where(approved: true) }

  def sluggy_slug
    return unless slug

    return if slug.match?(/^[a-z\-0-9]*[a-z]+[a-z\-0-9]*$/)

    errors.add(:slug, "can only contain lowercase letters, numbers, and dashes")
  end

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
      redirect_uri: "#{ENV["REACT_APP_API_URL"]}/stripe_oauth_callback",
      client_id: ENV["STRIPE_CLIENT_ID"] || "ca_Eowu0ycKNxFo46f8hqlCNCpt4w26bxer",
      state: stripe_state_token,
      "suggested_capabilities[]" => "card_payments"
    }.to_query
    "#{base}?#{params}"
  end

  def is_stripe_ready
    return true if stripe_user_id.present?

    false
  end

  def create_plan(nominal_amount)
    stripe_plan = Stripe::Plan.create(
      {
        product: stripe_product.id,
        nickname: "Ampled Support", # should this be based on the amount?
        interval: "month",
        currency: "usd",
        amount: ((nominal_amount + 30) / 0.971).round
      }, stripe_account: stripe_user_id
    )
    plan = Plan.new(stripe_id: stripe_plan.id, nominal_amount: nominal_amount)
    plans << plan
    plan
  end

  def cover_url
    images&.first&.url
  end

  def plan_for_nominal_amount(nominal_amount)
    plans.find_by(nominal_amount: nominal_amount) || create_plan(nominal_amount)
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
    return @stripe_product unless @stripe_product.statement_descriptor.nil?

    Stripe::Product.update(stripe_product_id, { statement_descriptor: name[0..21] }, stripe_account: stripe_user_id)
  end

  def subscriber_count
    active_subscribers.count
  end

  def monthly_total
    subscriptions.active.includes(:plan).reduce(0) do |sum, subscription|
      sum + subscription.plan.nominal_amount
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
    subscriptions.active.order(created_at: :desc).first&.user
  end

  def set_screenshot
    self.video_screenshot_url = find_screenshot_url(video_url) unless video_url.nil?
  end

  def check_approved
    return unless approved_changed? && approved

    ArtistPageApprovedEmailJob.perform_async(id) unless ENV["REDIS_URL"].nil?
  end

  def promote_facebook_image
    SocialImageService.facebook_share_image(self)
  end

  def promote_square_images
    SocialImageService.promote_square_images(self)
  end

  def promote_story_images
    SocialImageService.promote_story_images(self)
  end

  def supporter_images
    SocialImageService.supporter_images(self)
  end

  private

  def find_screenshot_url(video_url)
    if video_url.match?(/vimeo/i)
      vimeo_id = video_url.match(%r{vimeo.com/([\d\w]+)}i)[1]
      response = Faraday.get "https://vimeo.com/api/v2/video/" + vimeo_id + ".json"
      JSON.parse(response.body)[0]["thumbnail_large"]
    elsif video_url.match?(/youtu/i)
      youtube_id = video_url.match(%r{(youtube\.com/watch\?v=|youtu.be/)(.+)}i)[2]
      "https://img.youtube.com/vi/" + youtube_id + "/0.jpg"
    end
  end

  def create_product
    product = Stripe::Product.create(
      {
        name: "Ampled Support",
        type: "service",
        statement_descriptor: name[0..21]
      }, stripe_account: stripe_user_id
    )
    update(stripe_product_id: product.id)
  end
end
