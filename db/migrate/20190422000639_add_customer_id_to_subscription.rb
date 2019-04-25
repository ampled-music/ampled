class AddCustomerIdToSubscription < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :stripe_customer_id, :string
  end
end
