class AddFieldsToSubscription < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :status, :integer, default: 0, index: true
    add_column :subscriptions, :stripe_id, :string
  end
end
