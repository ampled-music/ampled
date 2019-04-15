class AddRoleToPageOwnerships < ActiveRecord::Migration[5.2]
  def change
    add_column :page_ownerships, :role, :string
  end
end
