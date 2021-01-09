class AddOrderToImage < ActiveRecord::Migration[5.2]
  def change
    add_column :images, :order, :integer
  end
end
