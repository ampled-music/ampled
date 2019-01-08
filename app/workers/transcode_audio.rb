class TranscodeAudio
  include Sidekiq::Worker

  # def perform(name, count)
  #  Zencoder::Job.create({ :input => 's3://bucket/key.mp4',
  #                         :outputs => [{ :label => 'vp8 for the web',
  #                                        :url => 's3://bucket/key_output.webm' }] })
  # end
end
