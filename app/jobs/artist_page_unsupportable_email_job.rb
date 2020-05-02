class ArtistPageUnsupportableEmailJob
  include Sidekiq::Worker
  attr_accessor :artist, :users, :nice_amount

  def perform(artist_id, amount)
    @artist = ArtistPage.find(artist_id)
    return if artist.blank?

    @users = artist.owners

    @nice_amount = format("$%.2f", amount / 100.0)

    SendBatchEmail.call(messages)
  end

  private

  def messages
    users.map do |user|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "artist-page-unsupportable",
        template_model: {
          artist_name: artist.name,
          nice_amount: nice_amount,
          stripe_link: artist.stripe_dashboard_url
        }
      }
    end
  end
end
