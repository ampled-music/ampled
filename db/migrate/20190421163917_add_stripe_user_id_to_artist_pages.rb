class AddStripeUserIdToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :stripe_user_id, :string
  end
end
