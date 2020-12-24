json.id user.id
json.name user.name
json.last_initial user.last_name.first unless user.last_name.nil?
json.image user.image, partial: "images/image", as: :image
json.location user.city

json.user user

json.supports(user&.subscriptions) do |subscription|
  json.subscription subscription
  json.name subscription.artist_page.name
  json.slug subscription.artist_page.slug
  json.id subscription.artist_page.id
  json.supporter_since subscription.created_at.strftime("%B %Y")
end
