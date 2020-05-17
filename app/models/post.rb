# == Schema Information
#
# Table name: posts
#
#  allow_download  :boolean          default(FALSE)
#  artist_page_id  :bigint(8)
#  body            :text
#  created_at      :datetime         not null
#  id              :bigint(8)        not null, primary key
#  is_private      :boolean          default(FALSE)
#  title           :string
#  updated_at      :datetime         not null
#  user_id         :bigint(8)
#  video_embed_url :string
#
# Indexes
#
#  index_posts_on_artist_page_id  (artist_page_id)
#  index_posts_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (artist_page_id => artist_pages.id)
#  fk_rails_...  (user_id => users.id)
#

class Post < ApplicationRecord
  belongs_to :artist_page
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :audio_uploads, dependent: :destroy
  has_many :images, as: :imageable, dependent: :destroy

  accepts_nested_attributes_for :audio_uploads, allow_destroy: true
  accepts_nested_attributes_for :images, allow_destroy: true

  def author
    user.name
  end

  def author_image
    user.profile_image_url
  end

  def has_audio
    return true if audio_uploads.any?

    false
  end

  def has_video_embed
    return true if video_embed_url.present?

    false
  end
end
