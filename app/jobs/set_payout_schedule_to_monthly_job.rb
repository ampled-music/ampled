class SetPayoutScheduleToMonthlyJob
  include Sidekiq::Worker

  # This job sets the Artist Page's payout schedule to monthly on the last day of the month
  # @param artist_page_id [String] The id of the artist page to do be updated
  def perform(artist_page_id)
    artist_page = ArtistPage.find(artist_page_id)

    Stripe::Account.update(
      artist_page.stripe_user_id,
      {
        settings: {
          payouts: {
            schedule: {
              interval: "monthly",
              monthly_anchor: 31
            }
          }
        }
      }
    )
  end
end
