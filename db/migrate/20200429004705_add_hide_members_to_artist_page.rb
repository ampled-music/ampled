class AddHideMembersToArtistPage < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :hide_members, :boolean, :default => false
  end
end
