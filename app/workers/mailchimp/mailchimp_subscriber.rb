module Mailchimp
  class MailchimpSubscriber
    include Sidekiq::Worker

    def perform(user_id, subscribe = true)
      @user = User.find(user_id)
      mailchimp.call(@user, subscribe)
    rescue StandardError => e
      raise e
    end

    private

    def mailchimp
      @mailchimp = Services::MailchimpListUpdater.new
    end
  end
end
