require "rails_helper"

RSpec.describe ArtistPage, type: :model do
  describe "#monthly_total" do
    context "with active subscriptions" do
      it "returns the montly total" do
        ap = create(:artist_page)
        plan_a = create(:plan, artist_page: ap)
        plan_b = create(:plan, artist_page: ap)
        subscriber_a = create(:user)
        subscriber_b = create(:user)
        create(:subscription, plan: plan_a, user: subscriber_a, artist_page: ap)
        create(:subscription, plan: plan_b, user: subscriber_b, artist_page: ap)

        expect(ap.monthly_total).to eq(plan_a.amount + plan_b.amount)
      end
    end

    context "without any subscriptions" do
      it "returns 0" do
        ap = create(:artist_page)

        expect(ap.monthly_total).to eq(0)
      end
    end
  end

  describe "#last_payout" do
    context "with a previous payout" do
      let(:existing_stripe_auth) { JSON.parse(File.read("stripe_account_stub.json")) }

      it "returns the payout date", vcr: true do
        ap = create(:artist_page, stripe_user_id: existing_stripe_auth["stripe_user_id"])

        Stripe::Charge.create(
          amount: 50_000,
          currency: "usd",
          source: "tok_bypassPending",
          transfer_data: {
            destination: ap.stripe_user_id
          }
        )

        Stripe::Payout.create(
          {
            amount: 1,
            currency: "usd",
            source_type: "card"
          },
          stripe_account: ap.stripe_user_id
        )

        expect(ap.last_payout).to eq(Time.new(2019, 5, 28, 0, 0, 0, "+00:00"))
      end
    end

    context "with no previous payout" do
      it "returns nil" do
        ap = create(:artist_page)

        expect(ap.last_payout).to eq(nil)
      end
    end
  end
end
