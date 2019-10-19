require "postmark-rails/templated_mailer"

class PostmarkMailer < ActionMailer::Base
  default from: "support@ampled.com"
  include PostmarkRails::TemplatedMailerMixin
end
