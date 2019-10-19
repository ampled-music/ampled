class PostNotificationMailer < PostmarkMailer
  # method name must match alias on postmark
  def post_notification(post:, user:)
    self.template_model = {
      artist_name: post.artist_page.name,
      post_title: post.title,
      post_url: "https://ampled.com/artist/#{post.artist_page.slug}"
    }

    mail to: user.email
  end
end
