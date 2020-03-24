# == Schema Information
#
# Table name: images
#
#  artist_page_id :bigint(8)
#  created_at     :datetime         not null
#  id             :bigint(8)        not null, primary key
#  public_id      :string
#  updated_at     :datetime         not null
#  url            :string
#
# Indexes
#
#  index_images_on_artist_page_id  (artist_page_id)
#

class Image < ApplicationRecord
  belongs_to :artist_page
end
