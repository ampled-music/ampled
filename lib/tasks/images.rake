namespace :images do

  # Folder into which we place images that are meant to be soft-deleted.
  # The public_id of the image is preserved, so that the deletion can be undone by
  # moving the image out of the folder into the Cloudinary root.
  SOFT_DELETE_FOLDER = "soft_deleted"

  desc "Soft-deletes images that aren't referenced by the database."
  task soft_delete_unused: [:environment] do
    next_cursor = nil
    while true do
      results = Cloudinary::Api.resources(type: "upload", next_cursor: next_cursor)
      next_cursor = results.fetch("next_cursor", nil)
      resources = results["resources"]
      Rails.logger.info "Found #{resources.length()} resources"

      resources.each do |resource|
        public_id = resource["public_id"]
        if public_id.include? "/"
          Rails.logger.info "Skipping resource with id #{public_id}. It appears to be in a folder."
          next
        end
        unless Image.find_by(public_id: public_id)
          Rails.logger.info "Soft-deleting #{public_id}"
          Cloudinary::Uploader.rename(public_id, "#{SOFT_DELETE_FOLDER}/#{public_id}")
        end
      end

      break unless next_cursor
    end
  end

  desc "Empties SOFT_DELETED_FOLDER, thus hard-deleting all the images within."
  task empty_soft_deleted: [:environment] do
    next_cursor = nil
    while true do
      results = Cloudinary::Api.resources(type: "upload", prefix: SOFT_DELETE_FOLDER, next_cursor: next_cursor)
      next_cursor = results.fetch("next_cursor", nil)
      resources = results["resources"]
      Rails.logger.info "Starting to hard-delete #{resources.length()} resources"

      resources.each do |resource|
        public_id = resource["public_id"]
        Rails.logger.info "Destroying #{public_id}"
        Cloudinary::Uploader.destroy(public_id)
      end
      break unless next_cursor
    end
  end
end
