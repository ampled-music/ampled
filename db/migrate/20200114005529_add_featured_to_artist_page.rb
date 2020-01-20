class AddFeaturedToArtistPage < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :featured, :boolean, :default => false
  end
end
