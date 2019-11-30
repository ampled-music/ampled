json.id user.id
json.name user.name
json.last_name user.last_name.first unless user.last_name.nil?
json.bio user.bio
json.profile_image_url user.profile_image_url
json.joined_since user.created_at.strftime("%B %Y")
json.supports(user&.subscriptions&.active) do |subscription|
  json.name subscription.artist_page.name
  json.slug subscription.artist_page.slug
  json.id subscription.artist_page.id
  json.supporter_since subscription.created_at.strftime("%B %Y")
end
json.member_of(user&.owned_pages) do |artist|
  json.name artist.name
  json.slug artist.slug
  json.id artist.id
end
