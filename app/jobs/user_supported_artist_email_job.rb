class UserSupportedArtistEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription, :artist_page, :user

  def perform(subscription_id)
    @subscription = Subscription.find(subscription_id)
    return if subscription.blank?

    @artist_page = subscription.artist_page
    @user = subscription.user

    SendBatchEmail.call(
      [{
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "user-supported-artist",
        template_model: {
          artist_name: artist_page.name,
          artist_page_link: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist_page.slug}",
          support_amount: format("%.2f", subscription.plan.nominal_amount / 100)
        }
      }]
    )
  end
end
