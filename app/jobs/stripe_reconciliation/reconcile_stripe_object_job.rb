module StripeReconciliation
  class ReconcileStripeObjectJob
    include Sidekiq::Worker

    def perform(stripe_object)
      stripe_object = OpenStruct.new(stripe_object)
      reconciler_class = case stripe_object.object
                         when "invoice"
                           InvoiceReconciler
                         end

      if reconciler_class.nil?
        log_info("not reconciling Stipe object type #{stripe_object.object}")

        return
      end

      log_info("reconciling Stripe object type #{stripe_object.object} with #{reconciler_class.name}")
      reconciler = reconciler_class.new(stripe_object)

      AnomalyNotifier.new(anomaly: reconciler.anomaly, stripe_object: stripe_object).notify unless reconciler.reconcile
    end

    private

    def log_info(message)
      Rails.logger.info("[#{self.class.name}] #{message}")
    end
  end
end
