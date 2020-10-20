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
      subscription = Subscription.find_by(stripe_id: @stripe_invoice.subscription)

      if subscription.nil?
        @anomaly = :subscription_not_found
        return false
      end

      if subscription.plan.nominal_amount != Money.new(@stripe_invoice.total, @stripe_invoice.currency)
        @anomaly = :unexpected_total
        return false
      end

      true
    end
  end
end
