json.id post.id
json.author post.author
json.authorId post.user_id
json.authorImage post.author_image
json.title post.title
json.created_at post.created_at.to_i
json.created_ago time_ago_in_words(post.created_at)
json.comments post.comments, partial: "comments/comment", as: :comment
json.is_private post.is_private
json.has_audio post.has_audio
json.image_url post.image_url
if PostPolicy.new(current_user, post).view_details?
  json.body post.body
  json.allow_details true
  json.audio_file post.audio_file
else
  json.body "#{post.body[0..50]}..."
  json.deny_details_lapsed current_user.present? && current_user&.subscribed?(post.artist_page) &&
                           current_user&.card_last4.present? && !current_user&.card_is_valid?
end
