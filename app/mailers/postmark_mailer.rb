require "postmark-rails/templated_mailer"

class PostmarkMailer < ActionMailer::Base
  default from: ENV["POSTMARK_FROM_EMAIL"]
  include PostmarkRails::TemplatedMailerMixin
end
