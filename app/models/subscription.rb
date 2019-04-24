# == Schema Information
#
# Table name: subscriptions
#
#  artist_page_id     :bigint(8)
#  id                 :bigint(8)        not null, primary key
#  plan_id            :bigint(8)        not null
#  stripe_customer_id :string
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

  has_one :plan

  before_destroy :check_stripe

  def check_stripe
    # raise "Don't just delete a subscription"
  end
end
