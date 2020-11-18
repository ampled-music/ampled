class ArtistPageApprovedEmailJob
  include Sidekiq::Worker
  attr_accessor :artist, :users

  def perform(artist_id)
    @artist = ArtistPage.find(artist_id)
    return if artist.blank?

    @users = artist.owners

    SendBatchEmail.call(messages)
  end

  private

  def messages
    social_image = SocialImages::Images::Square1.build(artist)

    users.map do |user|
      {
        from: Rails.application.config.postmark_from_email,
        to: user.email,
        template_alias: "artist-page-approved",
        template_model: {
          app_base_url: Rails.application.config.react_app_api_url,
          artist_name: artist.name,
          artist_slug: artist.slug,
          social_image_url: social_image[:url]
        }
      }
    end
  end
end
