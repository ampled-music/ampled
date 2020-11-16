module StripeReconciliation
  class ChargeReconciler
    attr_reader :anomaly

    # @param stripe_charge [Stripe::Charge]
    def initialize(stripe_charge)
      @stripe_charge = stripe_charge
    end

    # @return [Boolean] Returns `false` if an anomaly is detected, `true` otherwise.
    def reconcile
      if @stripe_charge.refunded
        @anomaly = :charge_refunded
        return false
      end

      true
    end
  end
end
