class AddChargeAmountAndCurrencyToPlan < ActiveRecord::Migration[5.2]
  def change
    add_column :plans, :currency, :string, null: false, length: 3, default: "usd"
    add_column :plans, :charge_amount, :integer
  end
end
