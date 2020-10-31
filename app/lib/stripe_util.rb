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
end
