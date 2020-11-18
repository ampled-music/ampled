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
        from: Rails.application.config.postmark_from_email,
        to: owner.email,
        template_alias: "new-supporter",
        template_model: {
          supporter_name: subscription.user.name,
          artist_name: artist.name,
          support_amount: format("%.2f", subscription.plan.nominal_amount),
          total_artist_support_amount: format("%.2f", artist.monthly_total)
        }
      }
    end
  end
end
