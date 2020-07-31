class AddImageCoordinates < ActiveRecord::Migration[5.2]
  def change
    add_column :images, :coordinates, :string
  end
end
