module Services
  class MailchimpListUpdater
    MailchimpFailed = Class.new(StandardError)

    def initialize
      return unless ENV["MAILCHIMP_API_KEY"]

      @mailchimp = Gibbon::Request.new(api_key: ENV["MAILCHIMP_API_KEY"], symbolize_keys: true)
      @mailchimp.timeout = 30
      @mailchimp.open_timeout = 30
    end

    # rubocop:disable Style/OptionalBooleanParameter
    def update_subscription(artist, user, subscribe = true)
      raise MailchimpFailed, "Couldn't initialize Mailchimp" unless @mailchimp

      status = (subscribe ? "subscribed" : "unsubscribed")
      list(user).upsert( # rubocop:disable Rails/SkipsModelValidations
        body: {
          email_address: user.email,
          status: status,
          merge_fields: {
            FNAME: user.name.to_s,
            LNAME: user.last_name.to_s,
            ARTISTNAME: artist.name.to_s
          }
        }
      )
    rescue Gibbon::MailChimpError => e
      raise e
    end
    # rubocop:enable Style/OptionalBooleanParameter

    private

    def list(user)
      @mailchimp.lists(ENV["MAILCHIMP_LIST_ID"]).members(user.lower_case_md5_hashed_email)
    end
  end
end
