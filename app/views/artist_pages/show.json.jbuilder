json.id @artist_page.id
json.name @artist_page.name
json.slug @artist_page.slug
json.location @artist_page.location
json.accent_color @artist_page.accent_color
json.video_url @artist_page.video_url
json.twitter_handle @artist_page.twitter_handle
json.instagram_handle @artist_page.instagram_handle
json.images @artist_page.images.map(&:url)
json.isStripeSetup @artist_page.is_stripe_ready

json.most_recent_supporter do
  if @artist_page.most_recent_supporter.present?
    json.partial! "users/user", user: @artist_page.most_recent_supporter
  else
    json.null!
  end
end

json.owners @artist_page.owners, partial: "users/user", as: :user

json.supporters @artist_page.active_subscribers, partial: "users/user", as: :user

json.posts @artist_page.posts, partial: "posts/post", as: :post
