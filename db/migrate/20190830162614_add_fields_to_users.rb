class AddFieldsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :city, :string
    add_column :users, :country, :string
    add_column :users, :twitter, :string
    add_column :users, :instagram, :string
    add_column :users, :bio, :string
    add_column :users, :ad_address, :string
    add_column :users, :ad_address2, :string
    add_column :users, :ad_city, :string
    add_column :users, :ad_state, :string
    add_column :users, :ad_zip, :string
    add_column :users, :ad_country, :string
  end
end
