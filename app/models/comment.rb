# == Schema Information
#
# Table name: comments
#
#  created_at :datetime         not null
#  id         :integer          not null, primary key
#  post_id    :integer
#  text       :text
#  updated_at :datetime         not null
#  user_id    :integer
#
# Indexes
#
#  index_comments_on_post_id  (post_id)
#  index_comments_on_user_id  (user_id)
#

class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user

  def author
    user.name
  end
end
