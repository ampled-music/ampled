class StripeController < ApplicationController
  layout "empty"

  def callback
    # This is the callback hit after the artist signs up for a stripe account
    stripe_account = authorize_stripe_account
    # to generate the stubs used in testing
    # File.open('other_stripe_account_stub.json','w'){ |f| f.write(stripe_account.to_json) }
    ap = ArtistPage.find_by(state_token: params[:state])
    ap.update(stripe_user_id: stripe_account["stripe_user_id"])
    redirect_to "/settings?stripesuccess=true"
  end

  private

  def authorize_stripe_account
    connection.post("https://connect.stripe.com/oauth/token",
                    client_secret: ENV["STRIPE_SECRET_KEY"],
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
