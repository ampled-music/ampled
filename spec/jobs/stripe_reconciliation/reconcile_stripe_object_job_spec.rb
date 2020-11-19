require "rails_helper"

module StripeReconciliation
  describe ReconcileStripeObjectJob, type: :job do
    describe "#perform" do
      let(:stripe_invoice_hash) do
        { "object" => "invoice" }
      end

      let(:stripe_charge_hash) do
        { "object" => "charge" }
      end

      it "reconciles an invoice with InvoiceReconciler" do
        expect(InvoiceReconciler).to receive(:new).with(Stripe::Invoice.construct_from(stripe_invoice_hash)).and_return(
          instance_double("InvoiceReconciler", reconcile: true)
        )

        expect(AnomalyNotifier).to receive(:new).never

        described_class.new.perform(stripe_invoice_hash)
      end

      it "reconciles a charge with ChargeReconciler" do
        expect(ChargeReconciler).to receive(:new).with(Stripe::Charge.construct_from(stripe_charge_hash)).and_return(
          instance_double("ChargeReconciler", reconcile: true)
        )

        expect(AnomalyNotifier).to receive(:new).never

        described_class.new.perform(stripe_charge_hash)
      end

      it "is silent when reconciling a Stripe object with an unknown type" do
        unknown_stripe_object = { "object" => "foo" }

        described_class.new.perform(unknown_stripe_object)
      end

      it "uses AnomalyNotifier when reconiliation fails" do
        expect(InvoiceReconciler).to receive(:new).with(Stripe::Invoice.construct_from(stripe_invoice_hash)).and_return(
          instance_double("InvoiceReconciler", reconcile: false, anomaly: :unexpected_currency)
        )

        expect(AnomalyNotifier).to receive(:new)
          .with(
            anomaly: :unexpected_currency,
            stripe_object: Stripe::Invoice.construct_from(stripe_invoice_hash)
          ).and_return(
            instance_double("AnomalyNotifier", notify: nil)
          )

        described_class.new.perform(stripe_invoice_hash)
      end
    end
  end
end
