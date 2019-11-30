json.id user.id
json.name user.name
json.profile_image_url user.profile_image_url
json.supports(user&.supported_artists) do |artist|
  json.name artist.name
  json.slug artist.slug
  json.id artist.id
end
json.memberOf(user&.owned_pages) do |artist|
  json.name artist.name
  json.slug artist.slug
  json.id artist.id
end
