class AddTimestampsToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_timestamps :subscriptions, null: true
    Subscription.update_all(created_at: Time.now, updated_at: Time.now)
    change_column_null :subscriptions, :created_at, false
    change_column_null :subscriptions, :updated_at, false
  end
end
