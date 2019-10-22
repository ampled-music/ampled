class SendEmailBatchJob
  include Sidekiq::Worker
  def perform(post_id)
    post = Post.find(post_id)
    return if post.blank?

    users_to_notify = post.artist_page.active_subscribers
    artist = post.artist_page

    client = Postmark::ApiClient.new(ENV["POSTMARK_API_TOKEN"])

    messages = users_to_notify.map do |user|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "post-notification",
        template_model: {
          artist_name: artist.name,
          post_title: post.title,
          post_url: "https://ampled.com/artist/#{artist.slug}"
        }
      }
    end

    client.deliver_in_batches_with_templates(messages)
  end
end
