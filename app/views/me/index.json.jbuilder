json.userInfo do
  json.id current_user&.id
  json.name current_user&.name
end
json.artistPages @owned&.concat(@supported) do |page|
  json.artistId page.id
  json.role page.role
end
json.subscriptions @subscriptions do |subscription|
  json.name subscription.artist_page.name
  json.image subscription.artist_page.banner_image_url
  json.last_post_date subscription.artist_page.last_post_date
  json.support_date subscription.created_at
  json.amount subscription.plan.amount
end
