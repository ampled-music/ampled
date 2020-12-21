module Mailchimp
  class MailchimpSubscriber
    include Sidekiq::Worker

    def perform(artist_id, user_id, subscribe = true)
      @artist = ArtistPage.find(artist_id)
      @user = User.find(user_id)
      mailchimp.call(@artist, @user, subscribe)
    rescue StandardError => e
      raise e
    end

    private

    def mailchimp
      @mailchimp = Services::MailchimpListUpdater.new
    end
  end
end
