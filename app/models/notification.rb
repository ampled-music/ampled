# == Schema Information
#
# Table name: notifications
#
#  created_at         :datetime         not null
#  id                 :bigint(8)        not null, primary key
#  is_unread          :boolean          default(TRUE)
#  link               :string
#  text               :text
#  updated_at         :datetime         not null
#  user_id            :bigint(8)
#

class Notification < ApplicationRecord
  belongs_to :user
end
