class ArtistPaidEmailJob
  include Sidekiq::Worker

  class ArtistNotFound < StandardError; end
  class ConnectAccountNotFound < StandardError; end

  def perform(connect_account_id, amount_in_cents, currency, arrival_date)
    artist_page = ArtistPage.find_by(stripe_user_id: connect_account_id)
    raise ArtistNotFound, "Artist not found for stripe user id: #{connect_account_id}" if artist_page.blank?

    connect_account = Stripe::Account.retrieve(connect_account_id)
    raise ConnectAccountNotFound, "Connect account not found for id: #{connect_account_id}" if connect_account.blank?

    SendBatchEmail.call([
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: connect_account.email,
        template_alias: "artist-paid",
        template_model: {
          artist_name: artist_page.name,
          amount_paid: format("%.2f", amount_in_cents / 100),
          currency_name: currency.upcase,
          arrival_date_formatted: arrival_date.strftime("%b %d, %Y")
        }
      }
    ])
  end
end
