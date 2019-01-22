json.id @artist_page.id
json.name @artist_page.name
json.location @artist_page.location
json.accent_color @artist_page.accent_color
json.banner_image_url @artist_page.banner_image_url
json.posts @artist_page.posts do |post|
  json.id post.id
  json.author post.author
  json.title post.title
  json.audio_file post.audio_file
  json.image_url post.image_url
  json.body post.body
  json.created_at post.created_at.to_i
  json.created_ago time_ago_in_words(post.created_at)
  json.comments post.comments, partial: "comments/comment", as: :comment
end
