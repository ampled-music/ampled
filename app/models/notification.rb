# == Schema Information
#
# Table name: notifications
#
#  created_at :datetime         not null
#  id         :integer          not null, primary key
#  is_unread  :boolean          default("true"), not null
#  link       :string
#  text       :text
#  updated_at :datetime         not null
#  user_id    :integer          not null
#
# Indexes
#
#  index_notifications_on_user_id  (user_id)
#

class Notification < ApplicationRecord
  belongs_to :user

  def read!
    update(is_unread: false)
  end
end
