class UpdateApplicationFeePercentJob
  include Sidekiq::Worker
  attr_accessor :artist_page, :application_fee_percent

  def perform(artist_page_id, application_fee_percent)
    @artist_page = ArtistPage.find(artist_page_id)
    @application_fee_percent = application_fee_percent

    log_info("setting new application_fee_percent for artist page" \
      " id=#{artist_page_id} application_fee_percent=#{application_fee_percent}")

    set_artist_page_application_fee
    update_remote_subscriptions
  end

  private

  def set_artist_page_application_fee
    @artist_page.update(application_fee_percent: @application_fee_percent)
  end

  def update_remote_subscriptions
    @artist_page.subscriptions.each do |subscription|
      log_info("updating application_fee_percent for subscription id=#{subscription.id}")
      Stripe::Subscription.update(
        subscription.stripe_id,
        {
          application_fee_percent: @application_fee_percent
        },
        stripe_account: @artist_page.stripe_user_id
      )
    rescue Stripe::StripeError => e
      Raven.capture_exception(e)
    end
  end

  def log_info(message)
    Rails.logger.info("[#{self.class.name}] #{message}")
  end
end
