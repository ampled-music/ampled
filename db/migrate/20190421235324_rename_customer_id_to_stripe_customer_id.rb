class RenameCustomerIdToStripeCustomerId < ActiveRecord::Migration[5.2]
  def change
    rename_column :users, :customer_id, :stripe_customer_id
  end
end
