class UserCancelledSubscriptionEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription, :artist_page, :user

  def perform(subscription_id)
    @subscription = Subscription.find(subscription_id)
    return if subscription.blank?
    return unless subscription.cancelled?

    @artist_page = subscription.artist_page
    @user = subscription.user

    SendBatchEmail.call(
      [{
        from: Rails.application.config.postmark_from_email,
        to: user.email,
        template_alias: "user-cancelled-subscription",
        template_model: {
          artist_name: artist_page.name,
          user_name: user.name,
          artist_support_link: "#{Rails.application.config.react_app_api_url}/support/#{artist_page.slug}"
        }
      }]
    )
  end
end
