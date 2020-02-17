json.array! @artist_pages do |artist_page|
  json.id artist_page.id
  json.name artist_page.name
  json.slug artist_page.slug
  json.location artist_page.location
  json.bio artist_page.bio
  json.accent_color artist_page.accent_color
  json.image artist_page.images[0][:url]
end
