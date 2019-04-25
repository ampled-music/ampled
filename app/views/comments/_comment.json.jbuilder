json.author comment.author
json.text comment.text
json.id comment.id
json.user_id comment.user_id
json.created_at comment.created_at.to_i
json.created_ago time_ago_in_words(comment.created_at)
