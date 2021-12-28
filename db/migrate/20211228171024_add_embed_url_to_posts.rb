class AddEmbedUrlToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :embed_url, :string
  end
end
