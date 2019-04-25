class AddIsPrivateToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :is_private, :boolean, :default => false
  end
end
