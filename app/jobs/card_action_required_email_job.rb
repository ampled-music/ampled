class CardActionRequiredEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription

  def perform(subscription_id)
    @subscription = Subscription.find(subscription_id)

    SendBatchEmail.call(
      [{
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: subscription.user.email,
        template_alias: "credit_card_action_required",
        template_model: {
          artist: subscription.artist_page.name
        }
      }]
    )
  end
end
