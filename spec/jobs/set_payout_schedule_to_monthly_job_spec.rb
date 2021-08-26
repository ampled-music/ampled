require "rails_helper"

describe SetPayoutScheduleToMonthlyJob, :vcr, type: :job do
  describe "#perform" do
    let(:artist_page) { StripeIntegrationTestHelper.create_artist_page_with_stripe_account }

    it "calls Stripe to update subscriptions with the correct parameters", focus: true do
      expect {
        described_class.new.perform(artist_page.id)
      }.to change {
        artist_page.stripe_account.payout_schedule.to_h
      }.from(
        {
          delay_days: 2,
          interval: "daily"
        }
      ).to(
        {
          delay_days: 2,
          interval: "monthly",
          monthly_anchor: 31
        }
      )
    end
  end
end
