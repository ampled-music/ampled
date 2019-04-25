class RemoveRoleFromPageOwnerships < ActiveRecord::Migration[5.2]
  def change
    remove_column :page_ownerships, :role
  end
end
