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

    token = user.confirmation_token
    destination_link = "#{Rails.application.config.react_app_api_url}/users/confirmation?confirmation_token=#{token}"

    SendBatchEmail.call(
      [{
        from: Rails.application.config.postmark_from_email,
        to: user.email,
        template_alias: "non-member-added-to-artist-page",
        template_model: {
          artist_name: artist.name,
          artist_admin_first_name: admin.name,
          destination_link: destination_link
        }
      }]
    )
  end
end
