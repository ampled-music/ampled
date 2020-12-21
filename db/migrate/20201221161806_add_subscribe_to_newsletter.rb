class AddSubscribeToNewsletter < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :subscribe_to_newsletter, :boolean
  end
end
