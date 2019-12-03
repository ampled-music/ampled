class AddCardValidityToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :card_is_valid, :boolean
  end
end
