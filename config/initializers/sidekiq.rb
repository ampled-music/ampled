Sidekiq.configure_server do |config|
  # the default Rails logger doesn't work in Sidekiq processes, instead we use the Sidekiq logger
  # Checkout https://github.com/mperham/sidekiq/issues/1682 for more info
  Rails.logger = Sidekiq::Logging.logger
  Sidekiq.strict_args!
end
