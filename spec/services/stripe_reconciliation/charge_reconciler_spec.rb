require "rails_helper"

module StripeReconciliation
  RSpec.describe ChargeReconciler, type: :service do
    describe "#reconcile" do
      let(:stripe_charge) do
        Stripe::Charge.construct_from(
          id: "ch_abc123",
          refunded: false
        )
      end

      describe "charge is normal" do
        it "returns true and doesn't record an anomaly" do
          reconciler = described_class.new(stripe_charge)

          result = reconciler.reconcile

          expect(result).to eq(true)
          expect(reconciler.anomaly).to be(nil)
        end
      end

      describe "charge is refunded" do
        it "returns false and records an anomaly" do
          stripe_charge.refunded = true
          reconciler = described_class.new(stripe_charge)

          result = reconciler.reconcile

          expect(result).to eq(false)
          expect(reconciler.anomaly).to be(:charge_refunded)
        end
      end
    end
  end
end
