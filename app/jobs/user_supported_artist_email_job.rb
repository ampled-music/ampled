class UserSupportedArtistEmailJob
  include Sidekiq::Worker
  attr_accessor :subscription, :artist_page, :user, :is_community

  def perform(subscription_id)
    @subscription = Subscription.find(subscription_id)
    return if subscription.blank?

    @artist_page = subscription.artist_page
    @user = subscription.user

    @is_community = artist_page.slug == "community"

    social_image = SocialImages::Images::SupporterSquare.build(artist_page)

    SendBatchEmail.call(
      [{
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: is_community ? "new-community-member" : "user-supported-artist",
        template_model: {
          artist_name: artist_page.name,
          artist_page_link: artist_page.url,
          promote_artist_page_link: "#{artist_page.url}/promote",
          social_image_url: social_image[:url],
          support_amount: format("%.2f", subscription.plan.nominal_amount)
        }
      }]
    )
  end
end
