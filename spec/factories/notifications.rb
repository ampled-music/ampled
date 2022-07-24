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

FactoryBot.define do
  factory :notification do
    link { "MyString" }
    text { "MyText" }
    is_unread { false }
    user { nil }
  end
end
