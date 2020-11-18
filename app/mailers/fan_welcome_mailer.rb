class FanWelcomeMailer < PostmarkMailer
  # method name must match alias on postmark
  def fan_welcome(user)
    token = user.confirmation_token
    self.template_model = {
      homepage_url: Rails.application.config.react_app_api_url,
      login_url: Rails.application.config.react_app_api_url,
      fan_email_address: user.email,
      support_email: Rails.application.config.postmark_from_email,
      ampled_membership_url: Rails.application.config.react_app_api_url,
      first_name: user.name,
      confirm_link: "#{Rails.application.config.react_app_api_url}/users/confirmation?confirmation_token=#{token}"
    }

    mail to: user.email
  end
end
