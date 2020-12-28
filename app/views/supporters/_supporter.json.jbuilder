json.id user.id
json.name user.name
json.last_name user.last_name unless user.last_name.nil?
json.location user.city

json.supports(user&.subscriptions) do |subscription|
  json.subscription subscription
  json.name subscription.artist_page.name
  json.slug subscription.artist_page.slug
  json.id subscription.artist_page.id
  json.supporter_since subscription.created_at.strftime("%B %Y")
end
