class StripeController < ApplicationController
  layout "empty"

  def callback
    # This is the callback hit after the artist signs up for a stripe account
    stripe_account = authorize_stripe_account
    ap = ArtistPage.find_by(state_token: params[:state])
    ap.update(stripe_user_id: stripe_account["stripe_user_id"])
    setup_account(ap)
    redirect_to "/stripe_success"
  end

  private

  def setup_account(artist_page)
    product = Stripe::Product.create(
      {
        name: "Ampled Support",
        type: "service"
      }, stripe_account: artist_page.stripe_user_id
    )

    artist_page.update(stripe_product_id: product.id)

    amount = 5 * 100
    plan = Stripe::Plan.create(
      {
        product: product.id,
        nickname: "Ampled Support $5",
        interval: "month",
        currency: "usd",
        amount: amount
      }, stripe_account: artist_page.stripe_user_id
    )

    artist_page.plans << Plan.new(stripe_id: plan.id, amount: amount)
  end

  def authorize_stripe_account
    connection.post("https://connect.stripe.com/oauth/token",
                    client_secret: "sk_test_WpL6hAXT7brfG79UaViblroq00X4X2uvkS",
    code: params[:code],
    grant_type: "authorization_code").body
  end

  def connection
    @connection ||= Faraday.new do |faraday|
      faraday.request :json
      faraday.response :json
      faraday.adapter Faraday.default_adapter
    end
  end
end
