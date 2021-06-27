module StripeUtil
  STRIPE_USD_FIXED_FEE = Money.new(30, "USD")
  STRIPE_USD_PERCENTAGE_FEE = 0.029

  # Return a Stripe-compatible three-letter ISO currency string for the given
  # Money object.
  #
  # @param money [Money] Money to determine currency from
  # @return [String] Stripe-compatible three-letter ISO currency string
  def self.stripe_currency(money)
    money.currency.iso_code.downcase
  end

  # Calculates the amount we need to charge for the nominal_amount
  # to be the after-fee amount (not including Ampled's platform fee).
  # We are charged 2.9% + 30 cents for USD transacitions
  #
  # Example:
  #   Nominal amount: $5.00
  #   Fees: $1.18
  #     Stripe fee: $0.46 (2.9% + $0.30)
  #     Ampled fee: $0.72 (13.24%)
  #   Charge amount: $5.46
  #
  # @param nominal_amount [Money] Nominal amount
  # @return [Money] Calculated charge amount
  # @raise [StandardError] Raised if the `nominal_amount` currency is not USD
  def self.charge_amount_for_nominal_amount(nominal_amount)
    case stripe_currency(nominal_amount)
    when "usd"
      (nominal_amount + STRIPE_USD_FIXED_FEE) / (1 - STRIPE_USD_PERCENTAGE_FEE)
    else
      raise "Stripe fee unknown for currency #{stripe_currency(nominal_amount)}"
    end
  end

  # Ampled comunicates application fees as a percentage of the nominal amount
  # of a supscription, but Stripe thinks of them as a percentages of the charge amount.
  #
  # Example:
  #   Nominal amount: $5.00
  #   Ampled application fee: 5%
  #   Application fee amount: 0.05 * $5.00 = $0.25
  #   Charge amount: $5.46
  #     Stripe fee: $0.46 (2.9% + $0.30)
  #
  #   Stripe application fee percentage: application fee amount / charge amount
  #      = $0.25 / $5.46 = 4.58%
  #
  # Stripe accepts two digits of precision, we should always round down to avoid overcharging.
  #
  # @param nominal_amount [Plan] Plan the application fee percent applies to
  # @param application_fee_percent [Float] The desired Ampled application fee, given base 100 (ie 43.45% == 43.45)
  # @return [Float] The percent to give Stripe to charge the given application fee percent
  def self.stripe_application_fee_percent(plan:, application_fee_percent:)
    application_fee_amount = plan.nominal_amount * (application_fee_percent / 100.0)
    percent_of_charge_amount = (application_fee_amount / plan.charge_amount) * 100.0

    percent_of_charge_amount.floor(2)
  end
end
