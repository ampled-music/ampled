class ArtistPageCreateEmailJob
  include Sidekiq::Worker
  attr_accessor :artist, :user

  def perform(artist_id, user_id)
    @artist = ArtistPage.find(artist_id)
    return if artist.blank?

    @user = User.find(user_id)
    return if user.blank?

    SendBatchEmail.call(
      [{
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "artist-page-created",
        template_model: {
          artist_name: artist_page.name
        }
      }]
    )
  end
end
