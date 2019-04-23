class AddPlanToSubscription < ActiveRecord::Migration[5.2]
  def change
    add_reference :subscriptions, :plan, foreign_key: true, null: false
  end
end
