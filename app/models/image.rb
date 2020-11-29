# == Schema Information
#
# Table name: images
#
#  coordinates    :string
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

  # Image params that are allowed by default.
  # For use by imageables that set Images via nested attributes.
  # 'id' and '_destroy' are needed to support deletion via nested attributes.
  PERMITTED_PARAMS = %i[id url public_id coordinates _destroy].freeze

  class << self
    # If the given parameters contain an 'images' key, copies the contents to an 'images_attributes'
    # key. This allows APIs for nested image attributes to accept the attributes through the more natural
    # 'images' key, while allowing us to use Rails' nested attributes support.
    #
    # @param [ActionController::Parameters]
    # @param [Symbol] The key that we expect to contain images attributes.
    # @return [ActionController::Parameters] The modified parameters (which are also modified in-place).
    def rename_params(params, object_key)
      return params unless params[object_key]&.include?(:images)

      params[object_key][:images_attributes] = params[object_key][:images]
      params
    end
  end
end
