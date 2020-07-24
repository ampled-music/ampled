class AddIsSoftDeleteToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :is_soft_deleted, :boolean, :default => false
  end
end
