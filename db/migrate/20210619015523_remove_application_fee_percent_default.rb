class RemoveApplicationFeePercentDefault < ActiveRecord::Migration[5.2]
  def change
    change_column_default :artist_pages, :application_fee_percent, from: 13.24, to: nil
  end
end
