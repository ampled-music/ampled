# == Schema Information
#
# Table name: contributors
#
#  created_at      :datetime         not null
#  id              :integer          not null, primary key
#  inactive_on     :date
#  joined_on       :date
#  updated_at      :datetime         not null
#  user_id         :integer
#  worker_owner_on :date
#
# Indexes
#
#  index_contributors_on_user_id  (user_id)
#

FactoryBot.define do
  factory :contributor do
    user
    joined_on { "2020-01-14" }
    worker_owner_on { "2020-08-20" }
    inactive_on { "2020-10-14" }
  end
end
