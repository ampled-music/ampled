class AddNameToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :name, :string, null: false
  end
end
