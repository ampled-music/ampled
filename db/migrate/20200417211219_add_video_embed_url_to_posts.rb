class AddVideoEmbedUrlToPosts < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :video_embed_url, :string
  end
end
