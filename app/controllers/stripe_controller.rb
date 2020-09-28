class StripeController < ApplicationController
  layout "empty"

  def callback
    # This is the callback hit after the artist signs up for a stripe account
    stripe_account = authorize_stripe_account

    # If this Stripe account is already linked to an ArtistPage, fail
    unless ArtistPage.find_by(stripe_user_id: stripe_account["stripe_user_id"]).nil?
      return redirect_to "/settings?stripesuccess=duplicate"
    end

    # to generate the stubs used in testing
    # File.open('other_stripe_account_stub.json','w'){ |f| f.write(stripe_account.to_json) }
    ap = ArtistPage.find_by(state_token: params[:state])
    # BA - Delete an artists state token after it's used?
    # SA - done 2020/04/13
    ap.update(stripe_user_id: stripe_account["stripe_user_id"], state_token: nil)
    redirect_to "/settings?stripesuccess=true"
  end

  def webhook
    logger.info "Stripe: Verifying webhook event..."

    return render json: {}, status: :bad_request unless is_account_hook || is_connect_hook

    logger.info "Stripe: Webhook event verified."

    object = params[:data][:object]
    connect_account_id = params[:account]
    event_type = params[:type]
    event_id = params[:id]
    logger.info "STRIPE EVENT: #{event_type} #{event_id} for #{connect_account_id} (live mode: #{params[:livemode]})"

    # Webhooks for Connect may send test data to live endpoints, so we need
    # to ignore test data in production
    if Rails.env.production? && !params[:livemode]
      logger.info "Stripe: Ignoring test mode event #{event_type} #{event_id} in production."
      return render json: {}
    end

    process_webhook(event_type, object, connect_account_id)
  end

  private

  def process_webhook(event_type, object, connect_account_id)
    StripeReconciliation::ReconcileStripeObjectJob.perform_async(object)
    case event_type
    when "invoice.payment_failed"
      return invoice_payment_failed(object)
    when "invoice.payment_succeeded"
      return invoice_payment_succeeded(object)
    when "payout.paid"
      return payout_paid(object, connect_account_id)
    else
      logger.warn "Stripe event type '#{event_type}' was received but is not being handled."
    end
    render json: {}
  end

  def invoice_payment_succeeded(object)
    usersub = Subscription.find_by(stripe_id: object[:subscription])
    logger.info "Stripe: usersub.id: #{usersub.id}"
    # integer cents e.g. 2000 for $20.00
    invoice_total = object[:total]
    # lowercase currency e.g. usd
    invoice_currency = object[:currency]

    logger.info "Stripe: sending CardChargedEmail to #{usersub.user.email} for #{invoice_total}"
    CardChargedEmailJob.perform_async(usersub.id, invoice_total, invoice_currency)
    render json: {}
  rescue StandardError => e
    Raven.extra_context(usersub: usersub) do
      Raven.capture_exception(e)
    end
    render json: { status: "error", message: e.message }, status: :bad_request
  end

  def invoice_payment_failed(object)
    usersub = Subscription.find_by(stripe_id: object[:subscription])
    user = User.find(usersub.user_id)

    # Mark user as having invalid card
    user.update(card_is_valid: false)

    # send notification to user.email that their payment failed
    logger.info "Stripe: sending CardDeclineEmail to #{user.email}"
    CardDeclineEmailJob.perform_async(usersub.id)
    # TODO: update subscription to mark as failed?
    render json: {}
  end

  def payout_paid(object, connect_account_id)
    # ignore non-connect events
    render json: {} && return if connect_account_id.blank?

    # amount paid (ex. 2000 => $20.00)
    amount_in_cents = object[:amount].to_i

    # currency
    currency = object[:currency]

    # when payout should arrive to bank (in UNIX epoch time)
    arrival_epoch_time = object[:arrival_date]

    # notify the stripe account / artist
    logger.info "Stripe: sending artist-paid email to connect account email."
    ArtistPaidEmailJob.perform_async(connect_account_id, amount_in_cents, currency, arrival_epoch_time)

    render json: {}
  rescue StandardError => e
    Raven.capture_exception(e)
    logger.error "Failed to email connect account on payout.paid. #{e.message}"
    render json: { status: "error", message: e.message }, status: :bad_request
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
      logger.warn "Stripe: Invalid webhook payload"
      return false
    rescue Stripe::SignatureVerificationError
      # Invalid signature
      logger.warn "Stripe: Invalid webhook signature"
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
