class RemoveProfileImageUrlFromUser < ActiveRecord::Migration[5.2]
  def up
    migrate_user_profile_image_urls_to_images
    remove_column :users, :profile_image_url
  end

  def down
    add_column :users, :profile_image_url, :string
    migrate_images_to_user_profile_image_urls
  end

  private

  def migrate_user_profile_image_urls_to_images
    User.where.not(profile_image_url: nil).each do |user|
      next if user.profile_image_url.blank?

      user.update!(image_attributes: make_attributes(user.profile_image_url))
    end
  end

  def migrate_images_to_user_profile_image_urls
    Image.where(imageable_type: "User").each do |image|
      image.imageable.update!(profile_image_url: image.url)
      image.destroy!
    end
  end

  def make_attributes(url)
    { url: url, public_id: url.split("/").last.split(".").first }
  end
end
