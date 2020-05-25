source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Heroku uses the ruby version to configure your application"s runtime.
ruby "2.5.8"

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
gem "paperclip", "~> 6.0.0"
gem "pg"
gem "postmark-rails", ">=0.19.0"
gem "puma"
gem "pundit"
gem "rack-canonical-host"
gem "rack-cors", require: "rack/cors"
gem "rails", "~> 5.2.1"
gem "sentry-raven"
gem "sidekiq"
gem "skylight"
gem "stripe"
gem "wavefile"
gem "zencoder"

# Front-endy
gem "autoprefixer-rails"
gem "bootstrap", "~> 4.1.3"
gem "coffee-rails"
gem "jquery-rails"
gem "sass-rails", require: false # Only needed for generator (e.g. rail g controller Users)
gem "sassc-rails"
gem "simple_form"
gem "slim-rails"
gem "uglifier"

# Tools
gem "awesome_print"
gem "pry"

# Env specific dependencies...

group :production, :acceptance do
  gem "rack-timeout"
end

group :development, :test do
  gem "factory_bot_rails"
  gem "rspec-rails"
  gem "rspec_junit_formatter"
  gem "rubocop", require: false
  gem "rubocop-performance", require: false
  gem "rubocop-rails", require: false
end

group :development do
  gem "annotate"
  gem "better_errors"
  gem "binding_of_caller"
  gem "dotenv-rails", require: "dotenv/rails-now"
  gem "launchy"
  gem "listen"
  gem "spring"
  gem "spring-commands-rspec"
  gem "spring-watcher-listen"
  # gem "guard"
  # gem "guard-rspec", ">= 4.6.5" # Resolves to 1.x without a version constraint. :/
  # gem "guard-livereload"
end

group :test do
  gem "capybara"
  # gem "capybara-email"
  gem "chromedriver-helper"
  gem "codecov", require: false
  gem "selenium-webdriver"
  gem "simplecov"
  gem "vcr"
  gem "webmock"
end
