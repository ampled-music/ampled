class ApprovalRequestMailer < PostmarkMailer
  # method name must match alias on postmark
  def approval_requested(artist_page, requesting_user)
    self.template_model = {
      artist_name: artist_page.name,
      artist_link: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist_page.slug}",
      artist_twitter: artist_page.twitter_handle.presence,
      artist_instagram: artist_page.instagram_handle.presence,
      user_name: requesting_user.name,
      user_email: requesting_user.email
    }

    mail to: "hello@ampled.com,austin@ampled.com"
  end
end
