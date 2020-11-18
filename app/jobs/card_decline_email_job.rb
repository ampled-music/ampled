class CardDeclineEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription

  def perform(subscription_id)
    @subscription = Subscription.find(subscription_id)
    return if subscription.blank?

    SendBatchEmail.call(
      [{
        from: Rails.application.config.postmark_from_email,
        to: subscription.user.email,
        template_alias: "credit_card_decline",
        template_model: {
          artist: subscription.artist_page.name
        }
      }]
    )
  end
end
