require "rails_helper"

module StripeReconciliation
  describe ReconcileStripeObjectJob, type: :job do
    describe "#perform" do
      let!(:stripe_object) do
        OpenStruct.new(object: "invoice")
      end

      it "reconciles an invoice with InvoiceReconciler" do
        expect(InvoiceReconciler).to receive(:new).with(stripe_object).and_return(
          instance_double("InvoiceReconciler", reconcile: true)
        )

        expect(AnomalyNotifier).to receive(:new).never

        described_class.new.perform(stripe_object)
      end

      it "is silent when reconciling a Stripe object with an unknown type" do
        stripe_object.object = "account"

        described_class.new.perform(stripe_object)
      end

      it "uses AnomalyNotifier when reconiliation fails" do
        expect(InvoiceReconciler).to receive(:new).with(stripe_object).and_return(
          instance_double("InvoiceReconciler", reconcile: false, anomaly: :unexpected_currency)
        )

        expect(AnomalyNotifier).to receive(:new)
          .with(anomaly: :unexpected_currency, stripe_object: stripe_object).and_return(
            instance_double("AnomalyNotifier", notify: nil)
          )

        described_class.new.perform(stripe_object)
      end
    end
  end
end
