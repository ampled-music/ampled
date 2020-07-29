json.id post.id
json.author post.author
json.authorId post.user_id
json.authorImage post.author_image, partial: "images/image", as: :image
json.title post.title
json.created_at post.created_at.to_i
json.created_ago time_ago_in_words(post.created_at)
json.comments post.comments, partial: "comments/comment", as: :comment
json.is_private post.is_private
json.allow_download post.allow_download
json.video_embed_url post.video_embed_url
json.has_audio post.has_audio
json.has_video_embed post.has_video_embed
json.images post.images, partial: "images/image", as: :image
if PostPolicy.new(current_user, post).view_details?
  json.body post.body
  json.allow_details true
  json.audio_uploads post.audio_uploads
else
  json.body "#{post.body[0..50]}..."
  json.deny_details_lapsed current_user.present? && current_user&.subscribed?(post.artist_page) &&
                           current_user&.card_last4.present? && !current_user&.card_is_valid?
end
if @expand_artist
  json.artist do
    json.id post.artist_page.id
    json.name post.artist_page.name
    json.slug post.artist_page.slug
    json.accent_color post.artist_page.accent_color
    json.hide_members post.artist_page.hide_members
  end
end
