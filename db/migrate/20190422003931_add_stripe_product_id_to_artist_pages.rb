class AddStripeProductIdToArtistPages < ActiveRecord::Migration[5.2]
  def change
    add_column :artist_pages, :stripe_product_id, :string
  end
end
