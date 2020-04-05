# == Schema Information
#
# Table name: page_ownerships
#
#  artist_page_id :integer
#  created_at     :datetime         not null
#  id             :bigint(8)        not null, primary key
#  instrument     :string
#  role           :string           default("member")
#  updated_at     :datetime         not null
#  user_id        :integer
#
# Indexes
#
#  index_page_ownerships_on_artist_page_id_and_user_id  (artist_page_id,user_id)
#  index_page_ownerships_on_user_id_and_artist_page_id  (user_id,artist_page_id)
#

class PageOwnership < ApplicationRecord
  belongs_to :user
  belongs_to :artist_page

  def is_admin 
    return role == "admin"
  end
end
