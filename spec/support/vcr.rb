require "vcr"
VCR.configure do |c|
  c.cassette_library_dir = "spec/vcr"
  c.hook_into :webmock
  c.configure_rspec_metadata!

  record_mode = ENV["VCR"] ? ENV["VCR"].to_sym : :once
  c.default_cassette_options = { record: record_mode }
  # use this to re-record all cassettes easily
  # VCR=all bundle exec rspec
end
