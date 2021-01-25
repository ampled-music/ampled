json.pages @artist_pages do |artist_page|
  json.id artist_page.id
  json.name artist_page.name
  json.slug artist_page.slug
  json.location artist_page.location
  json.bio artist_page.bio
  json.accent_color artist_page.accent_color
  json.image artist_page.images.empty? ? "" : artist_page.images[0][:url]
  json.cloudinaryImage artist_page.images[0]
end
json.count @artist_page_count
json.under_construction_count @artist_pages_under_construction_count
