class AddExternalSoical < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :bandcamp_handle, :string, after: :twitter_handle
    add_column :artist_pages, :youtube_handle, :string, after: :twitter_handle
    add_column :artist_pages, :external, :string, after: :twitter_handle
  end
end
