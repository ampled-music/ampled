class AddSlugToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :slug, :string
    add_index :artist_pages, :slug, unique: true
  end
end
