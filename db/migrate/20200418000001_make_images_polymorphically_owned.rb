class MakeImagesPolymorphicallyOwned < ActiveRecord::Migration[5.2]
  # Adds a polymorphic foreign key to Images table, so that an image can be owned by
  # any kind of model (the "imageable" model). Then migrates existing artist_page_id
  # references to the new polymorphic reference, and removes the obsolete column.
  def up
    add_reference :images, :imageable, polymorphic: true, index: true
    copy_artist_page_id_to_polymorphic_reference
    remove_column :images, :artist_page_id
  end

  def down
    add_column :images, :artist_page_id, :bigint
    add_index :images, :artist_page_id
    copy_polymorphic_reference_to_artist_page_id
    remove_reference :images, :imageable, polymorphic: true, index:true
  end

  private 

  def copy_artist_page_id_to_polymorphic_reference
    Image.all.each { |image|
      next unless image.artist_page_id
      image.imageable_type = "ArtistPage"
      image.imageable_id = image.artist_page_id
      image.save!
    }
  end

  def copy_polymorphic_reference_to_artist_page_id
    Image.where(imageable_type: "ArtistPage").each { |image|
      next unless image.imageable_id
      image.artist_page_id = image.imageable_id
      image.save!
    }
  end
end
