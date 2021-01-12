class UpdateApplicationFeePercentJob
  include Sidekiq::Worker
  attr_accessor :artist_page, :application_fee_percent

  # This job sets the application fee percent Ampled will collect for a given artist page.
  # @param artist_page_id [String] The id of the artist page to do be updated
  # @param application_fee_percent [Float] The desired application fee percent (eg. 12.3 = 12.3%)
  def perform(artist_page_id, application_fee_percent)
    @artist_page = ArtistPage.find(artist_page_id)
    @application_fee_percent = application_fee_percent

    log_info("setting new application_fee_percent for artist page" \
      " id=#{artist_page_id} application_fee_percent=#{application_fee_percent}")

    set_artist_page_application_fee
    update_stripe_subscriptions
  end

  private

  def set_artist_page_application_fee
    @artist_page.update(application_fee_percent: @application_fee_percent)
  end

  def update_stripe_subscriptions
    @artist_page.subscriptions.active.each do |subscription|
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
