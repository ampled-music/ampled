class FanWelcomeMailer < PostmarkMailer
  # method name must match alias on postmark
  def fan_welcome(user)
    self.template_model = {
      homepage_url: "http://ampled.com",
      login_url: "http://ampled.com",
      fan_email_address: user.email,
      support_email: ENV["POSTMARK_FROM_EMAIL"],
      ampled_membership_url: "http://ampled.com",
      first_name: user.name
    }

    mail to: user.email
  end
end
