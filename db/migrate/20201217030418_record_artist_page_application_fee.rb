class RecordArtistPageApplicationFee < ActiveRecord::Migration[5.2]
  def up
    add_column :artist_pages, :application_fee_percent, :decimal, null: false, default: 13.24, precision: 2
  end

  def down
    remove_column :artist_pages, :application_fee_percent
  end
end
