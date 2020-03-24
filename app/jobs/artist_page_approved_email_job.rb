class ArtistPageApprovedEmailJob
  include Sidekiq::Worker
  attr_accessor :artist, :user

  def perform(artist_id)
    @artist = ArtistPage.find(artist_id)
    return if artist.blank?

    @users = post.artist_page.owners

    SendBatchEmail.call(messages)
  end

  private

  def messages
    users.map do |user|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "artist-page-approved",
        template_model: {
          artist_name: artist.name,
          artist_page_link: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist.slug}"
        }
      }
    end
  end
end
