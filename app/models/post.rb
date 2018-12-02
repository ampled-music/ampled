# == Schema Information
#
# Table name: posts
#
#  artist_page_id :bigint(8)
#  body           :text
#  created_at     :datetime         not null
#  id             :bigint(8)        not null, primary key
#  image_url      :string
#  title          :string
#  updated_at     :datetime         not null
#  user_id        :bigint(8)
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

  def author
    user.name
  end
end
