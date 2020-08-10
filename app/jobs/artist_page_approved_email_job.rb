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
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "wip-artist-page-approved",
        template_model: {
          app_base_url: ENV["REACT_APP_API_URL"],
          artist_name: artist.name,
          artist_slug: artist.slug,
          social_image_url: social_image[:url]
        }
      }
    end
  end
end
