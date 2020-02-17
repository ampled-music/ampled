class AddApprovedToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :approved, :boolean, :default => false
  end
end
