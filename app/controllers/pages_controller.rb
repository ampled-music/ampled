class PagesController < ApplicationController
  def root
  end

  def stripe
    account = Stripe::Account.retrieve("{CONNECTED_STRIPE_ACCOUNT_ID}")
    account.login_links.create()
  end
end
