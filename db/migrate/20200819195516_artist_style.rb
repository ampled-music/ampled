class ArtistStyle < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :style_type, :string
  end
end
