# == Schema Information
#
# Table name: contributor_time
#
#  contributor_id :integer
#  created_at     :datetime         not null
#  ended_on       :date
#  hours          :float
#  id             :integer          not null, primary key
#  notes          :text
#  started_on     :date
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_contributor_time_on_contributor_id  (contributor_id)
#

class ContributorTime < ApplicationRecord
  belongs_to :contributor
end
