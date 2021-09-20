class SetPayoutsToMonthlyForAllArtists < ActiveRecord::Migration[5.2]
  def up
    ArtistPage.pluck(:id).each do |artist_page_id|
      SetPayoutScheduleToMonthlyJob.perform_async(artist_page_id)
    end
  end
end
