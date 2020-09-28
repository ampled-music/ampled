module StripeReconciliation
  class ReconcileStripeObjectJob
    include Sidekiq::Worker

    def perform(stripe_object)
      reconciler_class = case stripe_object["object"]
                         when "invoice"
                           InvoiceReconciler
                         end

      return unless reconciler_class

      reconciler = reconciler_class.new(stripe_object)

      AnomalyNotifier.new(anomaly: reconciler.anomaly, stripe_object: stripe_object).notify unless reconciler.reconcile
    end
  end
end
