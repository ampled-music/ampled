class AddVideoScreenshotUrlToArtistPage < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :video_screenshot_url, :string
  end
end
