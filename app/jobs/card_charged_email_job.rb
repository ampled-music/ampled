class CardChargedEmailJob
  include Sidekiq::Worker

  def perform(subscription, invoice_total, invoice_currency)
    SendBatchEmail.call(
      [{
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: subscription.user.email,
        template_alias: "card_charged",
        template_model: {
          artist: subscription.artist_page.name,
          last_4: subscription.user.card_last4,
          total_amount: number_to_currency(invoice_total / 100),
          currency_name: invoice_currency.upcase
        }
      }]
    )
  end
end
