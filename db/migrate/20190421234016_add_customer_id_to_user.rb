class AddCustomerIdToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :customer_id, :string
  end
end
