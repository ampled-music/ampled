module StripeReconciliation
  class ReconcileStripeObjectJob
    include Sidekiq::Worker

    # @param stripe_object_hash [Hash] A Stripe object represented as a hash
    def perform(stripe_object_hash)
      stripe_object = Stripe::Util.convert_to_stripe_object(stripe_object_hash.symbolize_keys)
      reconciler_class = case stripe_object
                         when Stripe::Charge
                           ChargeReconciler
                         when Stripe::Invoice
                           InvoiceReconciler
                         else
                           log_info("not reconciling Stripe object type #{stripe_object.object}")
                           return
                         end

      log_info("reconciling Stripe object type #{stripe_object.object} with #{reconciler_class.name}")
      reconciler = reconciler_class.new(stripe_object)

      AnomalyNotifier.new(anomaly: reconciler.anomaly, stripe_object: stripe_object).notify unless reconciler.reconcile
    end

    private

    # @param message [String]
    def log_info(message)
      Rails.logger.info("[#{self.class.name}] #{message}")
    end
  end
end
