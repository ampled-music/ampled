module StripeUtil
  def self.stripe_currency(money)
    money.currency.iso_code.downcase
  end
end
