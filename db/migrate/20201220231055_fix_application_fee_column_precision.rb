class FixApplicationFeeColumnPrecision < ActiveRecord::Migration[5.2]
  def up
    change_column :artist_pages, :application_fee_percent, :decimal, null: false, precision: 5, scale: 2
    change_column_default :artist_pages, :application_fee_percent, from: 13.0, to: 13.24

    ArtistPage.update_all(application_fee_percent: 13.24)
  end

  def down
    change_column :artist_pages, :application_fee_percent, :decimal, null: false, default: 13.24, precision: 2
  end
end
