class PostNotificationJob
  include Sidekiq::Worker
  attr_accessor :post, :artist, :users

  def perform(post_id)
    @post = Post.find(post_id)
    return if post.blank?

    @users = post.artist_page.active_subscribers
    @artist = post.artist_page

    users.map do |user|
      Notification.create!(user: user, text: "#{artist.name} just posted \"#{post.title}\"",
                           link: post.url)
    end

    SendBatchEmail.call(messages)
  end

  def btn_copy
    case @post.post_type
      when "Audio"
        "Listen on Ampled"
      when "Video"
        "Watch on Ampled"
      else
        "Check it out"
    end
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
          artist_image: artist.images.first&.url,
          artist_color: artist.accent_color,
          post_title: post.title,
          post_body: post.body,
          post_btn_copy: btn_copy,
          post_id: post.id,
          post_url: post.url
        }
      }
    end
  end
end
