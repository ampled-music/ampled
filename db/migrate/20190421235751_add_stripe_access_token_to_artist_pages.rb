class AddStripeAccessTokenToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :stripe_access_token, :string
  end
end
