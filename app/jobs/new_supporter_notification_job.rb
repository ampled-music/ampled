class NewSupporterNotificationJob
  include Sidekiq::Worker
  attr_accessor :subscription, :artist

  def perform(subscription_id)
    @subscription = Subscription.find(subscription_id)

    @artist = subscription.artist_page

    support_amount = format("%.2f", subscription.plan.nominal_amount)
    artist.owners.map do |owner|
      Notification.create!(user: owner, text: "#{subscription.user.name} supported your page for $#{support_amount}",
                           link: artist.url)
    end

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
          support_amount: format("%.2f", subscription.plan.nominal_amount),
          total_artist_support_amount: format("%.2f", artist.monthly_total)
        }
      }
    end
  end
end
