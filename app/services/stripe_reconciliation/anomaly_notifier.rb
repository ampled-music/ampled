module StripeReconciliation
  class AnomalyNotifier
    def initialize(anomaly:, stripe_object:)
      @anomaly = anomaly
      @stripe_object = stripe_object
    end

    def notify
      # TODO: Implement a more effective way to notify developers of an anomaly

      log_fields = {
        stripe_object_type: @stripe_object.object,
        stripe_object_id: @stripe_object.id,
        anomaly: @anomaly
      }

      Rails.logger.info("[#{self.class.name}] Anomaly detected #{log_fields}")
    end
  end
end
