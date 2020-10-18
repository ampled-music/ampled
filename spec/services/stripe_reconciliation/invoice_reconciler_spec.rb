require "rails_helper"

module StripeReconciliation
  RSpec.describe InvoiceReconciler, type: :service do
    describe "#reconcile" do
      let(:subscription) { create(:subscription) }
      let!(:stripe_invoice) do
        OpenStruct.new(
          currency: subscription.plan.currency,
          total: subscription.plan.nominal_amount.fractional,
          subscription: subscription.stripe_id
        )
      end
      let!(:reconciler) { described_class.new(stripe_invoice) }

      it "returns true and doesn't record an anomaly if an invoice is expected" do
        result = reconciler.reconcile

        expect(result).to be true
        expect(reconciler.anomaly).to be nil
      end

      it "returns false and records an anomaly if an invoice has an unexpected currency" do
        stripe_invoice.currency = "cad"

        result = reconciler.reconcile

        expect(result).to be false
        expect(reconciler.anomaly).to be :unexpected_total
      end

      it "returns false and records an anomaly if an invoice doesn't have a matching local subscription" do
        stripe_invoice.subscription = "some_id"

        result = reconciler.reconcile

        expect(result).to be false
        expect(reconciler.anomaly).to be :subscription_not_found
      end

      it "returns false and records an anomaly if an invoice doesn't have the expected total amount" do
        stripe_invoice.total = stripe_invoice.total - 1

        result = reconciler.reconcile

        expect(result).to be false
        expect(reconciler.anomaly).to be :unexpected_total
      end
    end
  end
end
