require "rails_helper"

describe SetPayoutScheduleToMonthlyJob, :vcr, type: :job do
  describe "#perform" do
    it "does nothing if the artist page does not have a stripe_user_id" do
      artist_page = create(:artist_page, stripe_user_id: nil)

      expect(Stripe::Account).not_to receive(:update)
      described_class.new.perform(artist_page.id)
    end

    it "calls Stripe to update subscriptions with the correct parameters" do
      artist_page = StripeIntegrationTestHelper.create_artist_page_with_stripe_account
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
