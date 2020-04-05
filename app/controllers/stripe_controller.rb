class StripeController < ApplicationController
  layout "empty"

  def callback
    # This is the callback hit after the artist signs up for a stripe account
    stripe_account = authorize_stripe_account
    # to generate the stubs used in testing
    # File.open('other_stripe_account_stub.json','w'){ |f| f.write(stripe_account.to_json) }
    ap = ArtistPage.find_by(state_token: params[:state])
    # BA - Delete an artists state token after it's used?
    ap.update(stripe_user_id: stripe_account["stripe_user_id"])
    redirect_to "/settings?stripesuccess=true"
  end

  def webhook
    logger.info "Stripe: Verifying webhook event..."

    return render json: {}, status: :bad_request unless is_account_hook || is_connect_hook

    logger.info "Stripe: Webhook event verified."

    object = params[:data][:object]
    connect_account = params[:data][:account]
    event_type = params[:type]
    event_id = params[:id]
    logger.info "STRIPE EVENT: #{event_type} #{event_id} for #{connect_account} (live mode: #{params[:livemode]})"

    # Webhooks for Connect may send test data, so we need to ignore that
    # in production
    return render json: {} if Rails.env.production? && !params[:livemode]

    process_webhook(object)
  end

  private

  def process_webhook(object)
    # for 'charge.failed' only
    # puts object[:customer]
    # puts object[:source][:last4]
    if event_type == "invoice.payment_failed"
      # This stripe_customer_id is created *on the Connected account* and stored
      # on the Subscription record - which is why we can find this record
      # with only this one ID.
      usersub = Subscription.find_by(stripe_customer_id: object[:customer])
      user = User.find(usersub.user_id)

      # Mark user as having invalid card
      user.update(card_is_valid: false)

      # send notification to user.email that their payment failed
      CardDeclineEmailJob.perform_async(usersub.id) unless ENV["REDIS_URL"].nil?
      # TODO: update subscription to mark as failed?
    elsif event_type == "invoice.payment_succeeded"
      usersub = Subscription.find_by(stripe_customer_id: object[:customer])
      # integer cents e.g. 2000 for $20.00
      invoice_total = object[:total]
      # lowercase currency e.g. usd
      invoice_currency = object[:currency]

    end
    render json: {}
  end

  def is_account_hook
    verify_webhook(ENV["STRIPE_WEBHOOK_SECRET"])
  end

  def is_connect_hook
    verify_webhook(ENV["STRIPE_CONNECT_WEBHOOK_SECRET"])
  end

  def verify_webhook(secret)
    # verify signature
    payload = request.body.read
    sig_header = request.env["HTTP_STRIPE_SIGNATURE"]

    begin
      Stripe::Webhook.construct_event(
        payload, sig_header, secret
      )
    rescue JSON::ParserError
      # Invalid payload
      logger.warning "Stripe: Invalid webhook payload"
      return false
    rescue Stripe::SignatureVerificationError
      # Invalid signature
      logger.warning "Stripe: Invalid webhook signature"
      return false
    end
    logger.info "Stripe: Valid webhook payload & signature"
    true
  end

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
