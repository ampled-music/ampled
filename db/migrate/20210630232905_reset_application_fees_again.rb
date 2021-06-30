class ResetApplicationFeesAgain < ActiveRecord::Migration[5.2]
  def up
    ArtistPage.pluck(:id).each do |artist_page_id|
      UpdateApplicationFeePercentJob.perform_async(artist_page_id, 7)
    end
  end
end
