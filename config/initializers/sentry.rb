Raven.configure do |config|
    config.dsn = ENV['RAVEN_DSN']
    config.async = lambda { |event|
      SentryJob.perform_later(event)
    }
    config.current_environment = ENV['HOSTNAME']
    config.excluded_exceptions = [] #+= ['ActionController::RoutingError']
  end