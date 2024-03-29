class SendBatchEmail
  def self.call(messages)
    new(messages).call
  end

  attr_accessor :messages

  def initialize(messages)
    @messages = messages
  end

  def call
    client.deliver_in_batches_with_templates(messages)
  end

  def client
    Postmark::ApiClient.new(ENV["POSTMARK_API_KEY"])
  end
end
