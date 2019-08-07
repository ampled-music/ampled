class RenameAmountNominalAmount < ActiveRecord::Migration[5.2]
  def change
    rename_column :plans, :amount, :nominal_amount
  end
end
