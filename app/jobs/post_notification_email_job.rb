class PostNotificationEmailJob
  include Sidekiq::Worker
  attr_accessor :post, :artist, :users

  def perform(post_id)
    @post = Post.find(post_id)
    return if post.blank?

    @users = post.artist_page.active_subscribers
    @artist = post.artist_page

    SendBatchEmail.call(messages)
  end

  private

  def messages
    users.map do |user|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: user.email,
        template_alias: "post-notification",
        template_model: {
          artist_name: artist.name,
          post_title: post.title,
          post_id: post.id,
          post_url: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist.slug}#post-#{post.id}"
        }
      }
    end
  end
end
