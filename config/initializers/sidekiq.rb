Sidekiq.configure_server do |config|
  # the default Rails logger doesn't work in Sidekiq processes, instead we use the Sidekiq logger
  Rails.logger = Sidekiq::Logging.logger
end
