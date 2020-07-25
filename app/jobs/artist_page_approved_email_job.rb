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
    social_share_images = []
    social_share_images << artist.banner_image
    social_share_images += artist.promote_square_images
    social_share_images += artist.promote_story_images

    users.map do |user|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "artist-page-approved",
        template_model: {
          artist_name: artist.name,
          artist_page_link: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist.slug}",
          social_share_images: social_share_images
        }
      }
    end
  end
end
