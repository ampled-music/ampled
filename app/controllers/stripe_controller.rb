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

  def webhook
    object = params[:data][:object]
    event_type = params[:type]
    logger.info "STRIPE EVENT: #{event_type} (live mode: #{params[:livemode]})"
    # for 'charge.failed' only
    # puts object[:customer]
    # puts object[:source][:last4]
    if event_type == "invoice.payment_failed"
      usersub = Subscription.find_by(stripe_customer_id: object[:customer])
      user = User.find(usersub.user_id)
      # TODO: send notification to user.email that their payment to ap.name failed
      # ap = ArtistPage.find_by(stripe_user_id: params[:account])

      # Mark user as having invalid card
      user.update(card_is_valid: false)

      # TODO: update subscription to mark as failed?
    end
    render json: {}
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
