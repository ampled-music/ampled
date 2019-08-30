json.userInfo do
  json.id current_user&.id
  json.name current_user&.name
  json.last_name current_user&.last_name
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
  json.image subscription.artist_page.images.first.url
  json.last_post_date subscription.artist_page.last_post_date
  json.support_date subscription.created_at
  json.amount subscription.plan.nominal_amount
end
json.ownedPages @owned_pages do |page|
  json.artistId page.id
  json.name page.name
  json.image page.images.first.url
  json.supportersCount page.subscriber_count
  json.monthlyTotal page.monthly_total
  json.lastPost page.last_post_date
  json.lastPayout page.last_payout
end
