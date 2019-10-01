class AddFieldsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :city, :string
    add_column :users, :country, :string
    add_column :users, :twitter, :string
    add_column :users, :instagram, :string
    add_column :users, :bio, :string
    add_column :users, :ship_address, :string
    add_column :users, :ship_address2, :string
    add_column :users, :ship_city, :string
    add_column :users, :ship_state, :string
    add_column :users, :ship_zip, :string
    add_column :users, :ship_country, :string
  end
end
