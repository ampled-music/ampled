require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module AmpledWeb
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    config.to_prepare do
      DeviseController.respond_to :html, :json
    end

    # Enable/disable generators.
    config.generators do |g|
      # Core Rails
      # g.orm              :active_record, primary_key_type: :uuid
      g.javascripts      false
      g.stylesheets      false
      g.helper           false

      # Specs
      g.factory_bot      true
      g.routing_specs    false
      g.view_specs       false
      g.controller_specs false
      g.request_specs    false
    end

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "*"

        resource "*",
                 headers: :any,
                 methods: %i[get post put patch delete options head],
                 expose: ["Authorization"]
      end
    end

    config.action_mailer.postmark_settings = { api_token: ENV["POSTMARK_API_KEY"] }

    # Rails will use eager_load_paths in production and staging, but not in development and test.
    # It is important to add code paths to be loaded to both autoload and eager_load paths for things
    # to work both in production and development.
    config.autoload_paths += %W[#{config.root}/lib]
    config.eager_load_paths += %W[#{config.root}/lib]

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
  end
end
