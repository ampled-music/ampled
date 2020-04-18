class SetMissingPublicIdsFromUrl < ActiveRecord::Migration[5.2]
  def up
    Image.all.each { |image| set_public_id(image) }
  end

  def down
    # Do nothing. We don't want to delete any public ids, since we don't know which
    # ones did we set manually.
  end

  private

  # Extracts the public id from the url.
  # The url is expected to look like:
  # https://res.cloudinary.com/ampled-web/image/upload/v1586222036/PUBLIC_ID.jpg
  def set_public_id(image)
    return if image.public_id

    image.public_id = image.url.split('/').last.split('.').first
    image.save!
  end
end
