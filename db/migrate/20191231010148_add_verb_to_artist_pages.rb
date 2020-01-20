class AddVerbToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :verb_plural, :boolean, :default => false
  end
end
