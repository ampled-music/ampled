

class FanWelcomeMailer < PostmarkMailer
  def fan_welcome(user) # must match alias on postmark
    self.template_model = {
      homepage_url: 'http://ampled.com',
      login_url: 'http://ampled.com',
      fan_email_address: user.email,
      support_email: 'support@ampled.com',
      ampled_membership_url: 'http://ampled.com'
    }

    mail to: user.email
  end
end
