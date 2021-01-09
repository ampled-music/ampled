module Mailchimp
  class MailchimpSubscriber
    include Sidekiq::Worker

    def perform(artist_id, user_id, subscribe = true)
      @artist = ArtistPage.find(artist_id)
      @user = User.find(user_id)
      mailchimp.update_subscription(@artist, @user, subscribe)
    end

    private

    def mailchimp
      @mailchimp = Services::MailchimpListUpdater.new
    end
  end
end
