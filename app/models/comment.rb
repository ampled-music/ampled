# == Schema Information
#
# Table name: comments
#
#  created_at :datetime         not null
#  id         :bigint(8)        not null, primary key
#  post_id    :bigint(8)
#  text       :text
#  updated_at :datetime         not null
#  user_id    :bigint(8)
#
# Indexes
#
#  index_comments_on_post_id  (post_id)
#  index_comments_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#  fk_rails_...  (user_id => users.id)
#

class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user
end
