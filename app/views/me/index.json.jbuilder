json.userInfo do
  json.id current_user&.id
  json.name current_user&.name
  json.last_name current_user&.last_name
  json.city current_user&.city
  json.country current_user&.country
  json.twitter current_user&.twitter
  json.instagram current_user&.instagram
  json.bio current_user&.bio
  json.ship_address current_user&.ship_address
  json.ship_address2 current_user&.ship_address2
  json.ship_city current_user&.ship_city
  json.ship_state current_user&.ship_state
  json.ship_zip current_user&.ship_zip
  json.ship_country current_user&.ship_country
  json.image current_user&.image, partial: "images/image", as: :image
  json.created_at current_user&.created_at
  json.email current_user&.email
  json.email_confirmed current_user&.confirmed_at.present?
  json.admin current_user&.admin?
  json.cardInfo do
    if @stripe_info.present?
      json.exp_month @stripe_info[:exp_month]
      json.exp_year @stripe_info[:exp_year]
      json.last4 @stripe_info[:last4]
      json.brand @stripe_info[:brand]
      json.is_valid @stripe_info[:is_valid]
    else
      json.null!
    end
  end
end
json.artistPages @owned&.concat(@supported) do |page|
  json.artistId page.id
  json.role page.role
end
json.subscriptions @subscriptions do |subscription|
  json.subscriptionId subscription.id
  json.artistApproved subscription.artist_page.approved
  json.artistPageId subscription.artist_page.id
  json.artistSlug subscription.artist_page.slug
  json.artistColor subscription.artist_page.accent_color
  json.name subscription.artist_page.name
  json.image subscription.artist_page.cover_public_id
  json.last_post_date subscription.artist_page.last_post_date
  json.support_date subscription.created_at
  json.amount subscription.plan.nominal_amount.fractional
  json.amountFees subscription.plan.charge_amount.fractional
  json.promoteSquareImages subscription.artist_page.promote_square_images
  json.promoteStoryImages subscription.artist_page.promote_story_images
  json.supporterImages subscription.artist_page.supporter_images
end
json.ownedPages @owned_pages do |page|
  json.role page.role
  json.instrument page.instrument
  json.artistApproved page.page.approved
  json.artistId page.page.id
  json.artistSlug page.page.slug
  json.artistColor page.page.accent_color
  json.name page.page.name
  json.image page.page.cover_public_id
  json.supportersCount page.page.subscriber_count
  json.monthlyTotal page.page.monthly_total.fractional
  json.lastPost page.page.last_post_date
  json.lastPayout page.page.last_payout
  json.stripeSignup page.role == "admin" ? page.page.stripe_signup_url : json.null
  json.stripeDashboard page.role == "admin" ? page.page.stripe_dashboard_url : json.null
  json.isStripeSetup page.page.is_stripe_ready
  json.promoteSquareImages page.page.promote_square_images
  json.promoteStoryImages page.page.promote_story_images
  json.supporterImages page.page.supporter_images
end
