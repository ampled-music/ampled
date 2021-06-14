class CardChargedEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription

  # rubocop:disable Naming/VariableNumber
  def perform(subscription_id, invoice_total, invoice_currency)
    @subscription = Subscription.find(subscription_id)

    SendBatchEmail.call(
      [{
        from: ENV["POSTMARK_FROM_EMAIL"],
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
  # rubocop:enable Naming/VariableNumber
end
