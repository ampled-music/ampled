require "postmark-rails/templated_mailer"

class PostmarkMailer < ActionMailer::Base
  default from: Rails.application.config.postmark_from_email
  include PostmarkRails::TemplatedMailerMixin
end
