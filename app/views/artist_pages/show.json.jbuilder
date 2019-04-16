json.id @artist_page.id
json.name @artist_page.name
json.location @artist_page.location
json.accent_color @artist_page.accent_color
json.video_screenshot_url @artist_page.video_screenshot_url
json.video_url @artist_page.video_url
json.twitter_handle @artist_page.twitter_handle
json.instagram_handle @artist_page.instagram_handle
json.images @artist_page.images.map(&:url)

json.owners @artist_page.owners do |owner|
  json.id owner.id
  json.name owner.name
  json.profile_image_url owner.profile_image_url
end

json.supporters @artist_page.subscribers do |supporter|
  json.id supporter.id
  json.name supporter.name
  json.profile_image_url supporter.profile_image_url
end

json.posts @artist_page.posts do |post|
  if !post.is_private || (post.is_private? && (@role == "supporter") || (@role == "owner"))
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
end
