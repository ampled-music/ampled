json.array! @posts do |post|
  json.partial! "posts/post", post: post
end
