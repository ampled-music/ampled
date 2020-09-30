module StripeReconciliation
  class InvoiceReconciler
    attr_reader :anomaly

    EXPECTED_CURRENCIES = ["usd"].freeze

    # @param stripe_invoice [OpenStruct] A JSON Stripe invoice, as an OpenStruct
    #
    def initialize(stripe_invoice)
      @stripe_invoice = stripe_invoice
    end

    def reconcile
      # TODO: Record currency on the Plan and use that to verify
      unless EXPECTED_CURRENCIES.include?(@stripe_invoice.currency)
        @anomaly = :unexpected_currency
        return false
      end

      subscription = Subscription.find_by(stripe_id: @stripe_invoice.subscription)

      if subscription.nil?
        @anomaly = :subscription_not_found
        return false
      end

      if subscription.plan.nominal_amount != @stripe_invoice.total
        @anomaly = :unexpected_amount
        return false
      end

      true
    end
  end
end
