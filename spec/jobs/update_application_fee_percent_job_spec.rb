require "rails_helper"

describe UpdateApplicationFeePercentJob, type: :job do
  describe "#perform" do
    let(:artist_page) { create(:artist_page, application_fee_percent: 14.1, stripe_user_id: "acct_kittehrock") }
    let(:application_fee_percent) { 10.0 }

    it "updates the application_fee_percent of the ArtistPage" do
      expect { described_class.new.perform(artist_page.id, application_fee_percent) }
        .to change { artist_page.reload.application_fee_percent }
        .from(BigDecimal("14.1", 5))
        .to(BigDecimal(application_fee_percent, 5))
    end

    it "calls Stripe to update subscriptions with the correct parameters" do
      plan = create(:plan, artist_page: artist_page,
        charge_amount: 634, nominal_amount: 500, currency: "USD")
      subscriptions = [
        create(:subscription, artist_page: artist_page, stripe_id: "sub_hugekittehfan", plan: plan),
        create(:subscription, artist_page: artist_page, stripe_id: "sub_mildkittehfan", plan: plan)
      ]

      subscriptions.each do |subscription|
        expect(Stripe::Subscription).to(
          receive(:update).with(
            subscription.stripe_id,
            {
              # The application fee amount is $0.50, 7.886% of $6.34, rounded down to 7.88%
              application_fee_percent: 7.88
            },
            stripe_account: "acct_kittehrock"
          )
        )
      end

      described_class.new.perform(artist_page.id, application_fee_percent)
    end

    it "does not call Stripe for cancelled subscriptions" do
      create(:subscription, artist_page: artist_page, status: :cancelled)
      create(:subscription, artist_page: artist_page, status: :pending_cancelled)

      expect(Stripe::Subscription).not_to receive(:update)

      described_class.new.perform(artist_page.id, application_fee_percent)
    end

    context "when updating a remote subscription raises a Stripe::StripeError" do
      it "continues updating other subscriptions" do
        create(:subscription, artist_page: artist_page, stripe_id: "sub_hugekittehfan")
        create(:subscription, artist_page: artist_page, stripe_id: "sub_mildkittehfan")

        error = Stripe::InvalidRequestError.new("no access", :stripe_customer_id)

        expect(Stripe::Subscription).to(
          receive(:update).with("sub_hugekittehfan", any_args).and_raise(error)
        )

        expect(Stripe::Subscription).to(
          receive(:update).with("sub_mildkittehfan", any_args)
        )

        expect(Raven).to(
          receive(:capture_exception).with(error)
        )

        described_class.new.perform(artist_page.id, application_fee_percent)
      end
    end
  end
end
