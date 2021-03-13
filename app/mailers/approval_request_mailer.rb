class ApprovalRequestMailer < PostmarkMailer
  # method name must match alias on postmark
  def approval_requested(artist_page, requesting_user)
    self.template_model = {
      artist_name: artist_page.name,
      artist_link: artist_page.url,
      artist_twitter: artist_page.twitter_handle.presence,
      artist_instagram: artist_page.instagram_handle.presence,
      artist_bandcamp: artist_page.bandcamp_handle.presence,
      user_name: requesting_user.name,
      user_email: requesting_user.email
    }

    mail to: "onboarding@ampled.com"
  end

  def artist_page_approval_requested_for_artists(artist_page, requesting_user)
    self.template_model = {
      artist_name: artist_page.name,
      artist_link: artist_page.url
    }

    mail to: requesting_user.email
  end
end
