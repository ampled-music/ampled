class RemoveImageUrlFromPost < ActiveRecord::Migration[5.2]
  def up
    migrate_post_image_urls_to_images
    remove_column :posts, :image_url
  end

  def down
    add_column :posts, :image_url, :string
    migrate_images_url_to_post_image_urls
  end

  private

  def migrate_post_image_urls_to_images
    Post.where.not(image_url: nil).each do |post|
      post.update!(images_attributes: [image_attributes(post.image_url)])
    end
  end

  def migrate_images_url_to_post_image_urls
    Image.where(imageable_type: 'Post').each do |image|
      image.imageable.update!(image_url: image.url)
    end
  end

  def image_attributes(url)
    {url: url, public_id: url.split('/').last.split('.').first}
  end
end
