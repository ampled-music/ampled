class StripeController < ApplicationController
  layout "empty"

  def callback
    # This is the callback hit after the artist signs up for a stripe account
    stripe_account = authorize_stripe_account
    # to generate the stub used in testing
    # File.open('stripe_account_stub.json','w'){ |f| f.write(stripe_account.to_json) }
    ap = ArtistPage.find_by(state_token: params[:state])
    ap.update(stripe_user_id: stripe_account["stripe_user_id"])
    redirect_to "/stripe_success"
  end

  private

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
