class AddAllowDownloadToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :allow_download, :boolean, :default => false
  end
end
