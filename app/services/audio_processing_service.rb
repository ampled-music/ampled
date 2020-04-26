class AudioProcessingService
  class FfmpegError < StandardError; end

  def initialize(public_id)
    @public_id = public_id
    @process_id = SecureRandom.uuid
    @raw_file_path = Rails.root.join("tmp/audio/raw_#{@process_id}")
    @s3 = Aws::S3::Resource.new

    # save audio to disk
    @s3.bucket(ENV["S3_BUCKET"]).object(public_id).get(response_target: @raw_file_path)
  end

  # == Generate Waveform
  #
  # Using ffmpeg, process original file:
  #
  #   1. transcode to PCM (WAV)
  #   2. downsample to reduce total frames
  #   3. lower bit depth
  #
  # The sample rate and bit depth can be fine tuned further.
  # Finally, read output file to build the waveform

  def generate_waveform(waveform_length = 200)
    # process original file
    @downsampled_file_path = Rails.root.join("tmp/audio/downsampled_#{@process_id}.wav")
    `ffmpeg -i #{@raw_file_path} -acodec pcm_u8 -ar 1000 -ac 1 #{@downsampled_file_path}`

    error_message = "FFMPEG: failed to transcode and downsample audio upload: #{@public_id}"
    raise FfmpegError, error_message unless File.exist?(@downsampled_file_path)

    # read output file one buffer at a time
    waveform_buffers = []
    reader = WaveFile::Reader.new(@downsampled_file_path.to_path)
    begin
      num_samples_per_waveform_buffer = (reader.total_sample_frames / waveform_length.to_f).ceil
      while reader.current_sample_frame < reader.total_sample_frames
        buffer_samples = reader.read(num_samples_per_waveform_buffer).samples
        waveform_buffers << buffer_samples unless buffer_samples.empty?
      end
    ensure
      reader.close
    end

    # normalize 8-bit amplitudes so that waveform values range from 0-128
    waveform = []
    waveform_buffers.each do |buffer|
      waveform << buffer.map { |sample| (sample - 128).abs }.max
    end

    waveform
  end

  def dispose
    # clean up / remove audio files from disk
    File.delete(@raw_file_path) if File.exist?(@raw_file_path)
    File.delete(@downsampled_file_path) if File.exist?(@downsampled_file_path)
  end
end
