class BatchEmailer
  def self.perform
    # WIP example
    client = Postmark::ApiClient.new(ENV["POSTMARK_API_TOKEN"])

    messages = users.map { |_u| Mailer.post_notification(post, user) }

    client.deliver_messages(messages)
  end
end
