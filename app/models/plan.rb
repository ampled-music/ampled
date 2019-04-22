# == Schema Information
#
# Table name: plans
#
#  amount         :integer          not null
#  artist_page_id :bigint(8)        not null
#  id             :bigint(8)        not null, primary key
#  stripe_id      :string           not null
#
# Indexes
#
#  index_plans_on_artist_page_id  (artist_page_id)
#
# Foreign Keys
#
#  fk_rails_...  (artist_page_id => artist_pages.id)
#

class Plan < ApplicationRecord
  belongs_to :artist_page
end
