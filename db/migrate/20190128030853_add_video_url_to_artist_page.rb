class AddVideoUrlToArtistPage < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :video_url, :string
  end
end
