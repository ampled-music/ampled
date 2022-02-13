module Mailchimp
  class MailchimpSubscriber
    include Sidekiq::Worker

    # rubocop:disable Style/OptionalBooleanParameter
    def perform(artist_id, user_id, subscribe = true)
      @artist = ArtistPage.find(artist_id)
      @user = User.find(user_id)
      mailchimp.update_subscription(@artist, @user, subscribe)
    end
    # rubocop:enable Style/OptionalBooleanParameter

    private

    def mailchimp
      @mailchimp = MailchimpListUpdater.new
    end
  end
end
