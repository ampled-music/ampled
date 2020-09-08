class RemoveStripeAccessTokenFromArtistPage < ActiveRecord::Migration[5.2]
  def up
    # Only perform the migration if all records have this field unset, as a safeguard.
    artist_pages_with_stripe_access_token_count = ArtistPage.where.not(stripe_access_token: nil).count
    if artist_pages_with_stripe_access_token_count > 0
      raise "Found #{artist_pages_with_stripe_access_token_count} Artist Pages with a Stripe token. Won't migrate."
    end
    remove_column :artist_pages, :stripe_access_token
  end

  def down
    add_column :artist_pages, :stripe_access_token, :string
  end
end
