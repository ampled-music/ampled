class UpdateArtistOwnerStatusJob
  include Sidekiq::Worker
  attr_accessor :artist_page

  def perform(artist_page_id)
    @artist_page = ArtistPage.find(artist_page_id)

    if !artist_page.artist_owner? && artist_eligible_to_become_artist_owner?
      artist_page.update!(artist_owner: true)
      ArtistOwnerStatusMailer.internal_artist_eligible_for_ownership(artist_page).deliver_now
      ArtistOwnerStatusMailer.artist_eligible_for_ownership(artist_page).deliver_now
    end
  end

  private

  def artist_eligible_to_become_artist_owner?
    artist_page.subscriptions.active.count >= ArtistPage::ARTIST_OWNER_THRESHOLD
  end
end
