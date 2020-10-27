class AddArtistPageArtistOwner < ActiveRecord::Migration[5.2]
  def up
    add_column :artist_pages, :artist_owner, :boolean, null: false, default: false

    Subscription
      .select(:artist_page_id)
      .active
      .group(:artist_page_id)
      .having("COUNT(*) >= 10")
      .includes(:artist_page).each do |subscription_group|
      subscription_group.artist_page.update!(artist_owner: true)
    end
  end

  def down
    remove_column :artist_pages, :artist_owner
  end
end
