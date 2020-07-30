class AddExternalSoical < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :bandcamp_handle, :string
    add_column :artist_pages, :youtube_handle, :string
    add_column :artist_pages, :external_handle, :string
  end
end
