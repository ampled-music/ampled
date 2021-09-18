require "rails_helper"

module StripeReconciliation
  RSpec.describe AnomalyNotifier, type: :service do
    describe "#notify" do
      let(:anomaly) { :unexpected_currency }
      let(:stripe_object) do
        OpenStruct.new(
          object: "invoice",
          id: "in_1036Vr2eZvKYlo2CfjuUHA94"
        )
      end
      let(:notifier) { described_class.new(anomaly: anomaly, stripe_object: stripe_object) }

      it "logs anomaly and Stripe details" do
        expected_log_message = "[StripeReconciliation::AnomalyNotifier] Anomaly detected " \
                               "{:stripe_object_type=>\"invoice\", " \
                               ":stripe_object_id=>\"in_1036Vr2eZvKYlo2CfjuUHA94\", " \
                               ":anomaly=>:unexpected_currency}"

        expect(Rails.logger).to receive(:info).with(expected_log_message)

        notifier.notify
      end

      it "calls Raven.capture_exception with an AnomalyDetectedException" do
        expect(Raven).to receive(:capture_exception).with(
          kind_of(AnomalyDetectedException),
          extra: {
            stripe_object_type: "invoice",
            stripe_object_id: "in_1036Vr2eZvKYlo2CfjuUHA94",
            anomaly: :unexpected_currency
          }
        )
        notifier.notify
      end

      context "in acceptance" do
        before(:each) do
          allow(Rails).to receive(:env).and_return(ActiveSupport::StringInquirer.new("acceptance"))
        end

        it "does not call Raven.capture_exception" do
          expect(Raven).not_to receive(:capture_exception)
          notifier.notify
        end
      end
    end
  end
end
