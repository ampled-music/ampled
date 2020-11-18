class CardChargedEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription

  def perform(subscription_id, invoice_total, invoice_currency)
    @subscription = Subscription.find(subscription_id)

    SendBatchEmail.call(
      [{
        from: Rails.application.config.postmark_from_email,
        to: subscription.user.email,
        template_alias: "card_charged",
        template_model: {
          artist: subscription.artist_page.name,
          last_4: subscription.user.card_last4,
          total_amount: format("%.2f", invoice_total / 100.0),
          currency_name: invoice_currency.upcase
        }
      }]
    )
  end
end
