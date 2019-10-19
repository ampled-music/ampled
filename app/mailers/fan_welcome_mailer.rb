class FanWelcomeMailer < PostmarkMailer
  # method name must match alias on postmark
  def fan_welcome(user)
    self.template_model = {
      homepage_url: "http://ampled.com",
      login_url: "http://ampled.com",
      fan_email_address: user.email,
      support_email: "support@ampled.com",
      ampled_membership_url: "http://ampled.com"
    }

    mail to: user.email
  end
end
