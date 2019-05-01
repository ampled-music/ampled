# == Schema Information
#
# Table name: subscriptions
#
#  artist_page_id     :bigint(8)
#  created_at         :datetime         not null
#  id                 :bigint(8)        not null, primary key
#  plan_id            :bigint(8)        not null
#  stripe_customer_id :string
#  updated_at         :datetime         not null
#  user_id            :bigint(8)
#
# Indexes
#
#  index_subscriptions_on_artist_page_id  (artist_page_id)
#  index_subscriptions_on_plan_id         (plan_id)
#  index_subscriptions_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (artist_page_id => artist_pages.id)
#  fk_rails_...  (plan_id => plans.id)
#  fk_rails_...  (user_id => users.id)
#

class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :artist_page

  belongs_to :plan

  belongs_to :plan

  before_destroy :check_stripe

  def check_stripe
    # raise "Don't just delete a subscription"
  end
end
