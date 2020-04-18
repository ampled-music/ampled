class AddPublicIdToImages < ActiveRecord::Migration[5.2]
  def change
    add_column :images, :public_id, :string
    remove_column :images, :order, :integer 
  end
end
