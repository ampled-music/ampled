class NewSupporterEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription, :artist

  def perform(subscription_id)
    @subscription = Subscription.find(subscription_id)
    return if subscription.blank?

    @artist = subscription.artist_page

    SendBatchEmail.call(messages)
  end

  private

  def messages
    artist.owners.map do |owner|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: owner.email,
        template_alias: "new-supporter",
        template_model: {
          supporter_name: subscription.user.name,
          artist_name: artist.name,
          support_amount: format("%.2f", subscription.plan.nominal_amount / 100),
          total_artist_support_amount: format("%.2f", artist.monthly_total / 100)
        }
      }
    end
  end
end
