class AddDeleteToken < ActiveRecord::Migration[5.2]
  def change
    add_column :images, :delete_token, :string
  end
end
