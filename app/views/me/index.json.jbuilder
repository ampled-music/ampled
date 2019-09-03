json.userInfo do
  json.id current_user&.id
  json.name current_user&.name
  json.last_name current_user&.last_name
  json.city current_user&.city
  json.country current_user&.country
  json.twitter current_user&.twitter
  json.instagram current_user&.instagram
  json.bio current_user&.bio
  json.ad_address current_user&.ad_address
  json.ad_address2 current_user&.ad_address2
  json.ad_city current_user&.ad_city
  json.ad_state current_user&.ad_state
  json.ad_zip current_user&.ad_zip
  json.ad_country current_user&.ad_country
  json.image current_user&.profile_image_url
  json.created_at current_user&.created_at
end
json.artistPages @owned&.concat(@supported) do |page|
  json.artistId page.id
  json.role page.role
end
json.subscriptions @subscriptions do |subscription|
  json.subscriptionId subscription.id
  json.artistPageId subscription.artist_page.id
  json.name subscription.artist_page.name
  json.image subscription.artist_page.cover_url
  json.last_post_date subscription.artist_page.last_post_date
  json.support_date subscription.created_at
  json.amount subscription.plan.nominal_amount
end
json.ownedPages @owned_pages do |page|
  json.artistId page.id
  json.name page.name
  json.image page.cover_url
  json.supportersCount page.subscriber_count
  json.monthlyTotal page.monthly_total
  json.lastPost page.last_post_date
  json.lastPayout page.last_payout
  json.stripeSignup page.stripe_signup_url
  json.stripeDashboard page.stripe_dashboard_url
end
