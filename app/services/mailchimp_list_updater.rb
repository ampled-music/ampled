module Services
  class MailchimpListUpdater
    MailchimpFailed = Class.new(ServiceActionError)

    def initialize
      return unless ENV["MAILCHIMP_API_KEY"]

      @mailchimp = Gibbon::Request.new(api_key: ENV["MAILCHIMP_API_KEY"], symbolize_keys: true)
      @mailchimp.timeout = 30
      @mailchimp.open_timeout = 30
    end

    def call(user, subscribe = true)
      raise MailchimpFailed.new unless @mailchimp

      status = (subscribe ? "subscribed" : "unsubscribed")
      list(user).upsert(
        body: {
          email_address: user.email,
          status: status,
          merge_fields: {
            FNAME: user.first_name.to_s,
            LNAME: user.last_name.to_s,
            ARTISTNAME: user.artist_name.to_s
          }
        }
      )
    rescue Gibbon::MailChimpError => e
      raise e
    end

    private

    def list(user)
      @mailchimp.lists(ENV["MAILCHIMP_LIST_ID"]).members(user.lower_case_md5_hashed_email)
    end
  end
end
