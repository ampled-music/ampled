class ArtistPageMemberCreatedJob
  include Sidekiq::Worker
  attr_accessor :artist, :user, :admin

  def perform(artist_id, user_id, admin_id)
    @artist = ArtistPage.find(artist_id)
    return if artist.blank?

    @user = User.find(user_id)
    return if user.blank?

    @admin = User.find(admin_id)
    return if admin.blank?

    SendBatchEmail.call(
      [{
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "non-member-added-to-artist-page",
        template_model: {
          artist_name: artist.name,
          artist_admin_first_name: admin.name,
          destination_link: "#{ENV["REACT_APP_API_URL"]}/reset-password"
        }
      }]
    )
  end
end
