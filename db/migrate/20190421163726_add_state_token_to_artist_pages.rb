class AddStateTokenToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :state_token, :string
  end
end
