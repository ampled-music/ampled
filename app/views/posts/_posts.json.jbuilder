json.id post.id
json.author post.author
json.authorImage post.author_image
json.title post.title
json.created_at post.created_at.to_i
json.created_ago time_ago_in_words(post.created_at)
json.comments post.comments, partial: "comments/comment", as: :comment
json.is_private post.is_private
json.image_url post.image_url
if PostPolicy.new(current_user, post).view_details?
json.allow_details true
json.body post.body
json.audio_file post.audio_file
end