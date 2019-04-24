# == Schema Information
#
# Table name: subscriptions
#
#  artist_page_id     :bigint(8)
#  created_at         :datetime         not null
#  id                 :bigint(8)        not null, primary key
#  plan_id            :bigint(8)        not null
#  status             :integer          default("pending_active")
#  stripe_customer_id :string
#  stripe_id          :string
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

  has_one :plan

  before_destroy :check_stripe

  validate :plan_must_belong_to_artist

  enum status: { pending_active: 0, active: 1, pending_cancelled: 2, cancelled: 3 }

  def check_stripe
    raise "Don't just delete a subscription"
  end

  def cancel!
    Stripe::Subscription.retrieve(stripe_id, stripe_account: artist_page.stripe_user_id).delete
    update(status: :cancelled)
  end

  private

  # Don't really want to do giant join user -> subscription -> plan -> artist_page
  # so denormalizing for now
  def plan_must_belong_to_artist
    errors.add(:plan, "Plan must belong to artist page") unless plan.artist_page == artist_page
  end
end
