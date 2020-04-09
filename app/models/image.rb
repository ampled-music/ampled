# == Schema Information
#
# Table name: images
#
#  created_at     :datetime         not null
#  id             :bigint(8)        not null, primary key
#  imageable_id   :bigint(8)
#  imageable_type :string
#  public_id      :string
#  updated_at     :datetime         not null
#  url            :string
#
# Indexes
#
#  index_images_on_imageable_type_and_imageable_id  (imageable_type,imageable_id)
#

class Image < ApplicationRecord
  belongs_to :imageable, polymorphic: true
end
