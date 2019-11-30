json.id user.id
json.name user.name
json.bio user.bio
json.profile_image_url user.profile_image_url
json.joined_since user.created_at.strftime("%B %Y")
json.supports(user&.supported_artists) do |artist|
  json.name artist.name
  json.slug artist.slug
  json.id artist.id
end
json.member_of(user&.owned_pages) do |artist|
  json.name artist.name
  json.slug artist.slug
  json.id artist.id
end
