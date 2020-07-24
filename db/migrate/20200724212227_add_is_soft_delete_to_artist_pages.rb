class AddIsSoftDeleteToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :is_soft_deleted, :boolean, :default => false
    add_column :artist_pages, :permanently_delete_at, :datetime, :default => nil
  end
end
