class CreateArtistPages < ActiveRecord::Migration[5.2]
  def change
    create_table :artist_pages do |t|
      t.string :name
      t.string :location
      t.string :bio
      t.string :accent_color
      t.string :banner_image_url
      t.string :twitter_handle
      t.string :instagram_handle
      t.timestamps
    end
  end
end
