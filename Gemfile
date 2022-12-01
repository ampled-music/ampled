source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Heroku uses the ruby version to configure your application"s runtime.
ruby "2.7.7"

# Back-endy
gem "administrate"
gem "aws-sdk", "~> 3"
gem "bootsnap", require: false
gem "cloudinary"
gem "devise"
gem "devise-jwt"
gem "faker"
gem "faraday"
gem "faraday_middleware"
gem "jbuilder"
gem "jwt"
gem "kaminari"
gem "money"
gem "net-http"
gem "nokogiri"
gem "pg"
gem "postmark-rails", ">=0.19.0"
gem "puma"
gem "pundit"
gem "rack-canonical-host"
gem "rack-cors", require: "rack/cors"
gem "rails", "~> 7.0"
gem "sentry-raven"
gem "sidekiq"
gem "stripe"
gem "uri", "0.10.0"
gem "wavefile"
gem "zencoder"

# Front-endy
# Use uglifier for JavaScript compression.
# This is only useful for things like the /admin/ engine, since this is an API-only server that serves no HTML/JS/CSS.
gem "simple_form"
gem "uglifier"
# We still have .slim files. Unclear if they are still used, but requires more investigation.
gem "slim-rails"

# Tools
gem "awesome_print"
gem "pry"

# Env specific dependencies...

group :production, :acceptance do
  gem "rack-timeout"
end

group :development, :test do
  gem "dotenv-rails", require: "dotenv/rails-now"
  gem "factory_bot_rails"
  gem "rspec_junit_formatter"
  gem "rspec-rails"
  gem "rubocop", require: false
  gem "rubocop-performance", require: false
  gem "rubocop-rails", require: false
end

group :development do
  gem "annotate"
  gem "better_errors"
  gem "binding_of_caller"
  gem "bullet"
  gem "launchy"
  gem "listen"
end

group :test do
  gem "capybara"
  gem "chromedriver-helper"
  gem "selenium-webdriver"
  gem "simplecov"
  gem "vcr"
  gem "webmock"
end
