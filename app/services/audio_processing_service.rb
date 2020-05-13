class AudioProcessingService
  DEFAULT_WAVEFORM_LENGTH = 1000

  class FfmpegError < StandardError; end

  def initialize(public_id)
    @public_id = public_id
    @process_id = SecureRandom.uuid
    @raw_file_path = Rails.root.join("tmp/audio/raw_#{@process_id}")
    @s3 = Aws::S3::Resource.new

    # save audio to disk
    @s3.bucket(ENV["S3_BUCKET"]).object(public_id).get(response_target: @raw_file_path)
  end

  # generate SHA256 hash from file
  def generate_hash
    sha256 = Digest::SHA256.file @raw_file_path
    sha256.hexdigest
  end

  # probe file for duration
  def duration
    duration = `ffprobe -i #{@raw_file_path} -show_entries format=duration -v quiet -of csv="p=0"`
    duration.to_i
  end

  # == Generate Waveform
  #
  # Using ffmpeg, process original file:
  #
  #   1. transcode to PCM (.wav)
  #   2. downsample to 1000 Hz to reduce total frames (-ar 1000)
  #   3. reduce stereo to one channel (-ac 1)
  #   4. lower bit depth to 8-bit unsigned (-acodec pcm_u8)
  #
  # The sample rate and bit depth can be fine tuned further.
  # Finally, read output file to build the waveform using peak normalization.
  #
  def generate_waveform
    # process original file
    @downsampled_file_path = Rails.root.join("tmp/audio/downsampled_#{@process_id}.wav")
    `ffmpeg -i #{@raw_file_path} -acodec pcm_u8 -ar 1000 -ac 1 #{@downsampled_file_path}`

    error_message = "FFMPEG: failed to transcode and downsample audio upload: #{@public_id}"
    raise FfmpegError, error_message unless File.exist?(@downsampled_file_path)

    # ready output file buffers
    waveform_buffers = read_waveform_buffers

    # reduce to one positive amplitude value per waveform buffer
    waveform = []
    waveform_buffers.each do |buffer|
      waveform << buffer.map { |sample| (sample - 128).abs }.max
    end

    # peak normalization
    peak = waveform.max
    gain = 128 - peak
    waveform = waveform.map { |sample| sample + gain }

    waveform
  end

  def dispose
    # clean up / remove audio files from disk
    File.delete(@raw_file_path) if File.exist?(@raw_file_path)
    File.delete(@downsampled_file_path) if File.exist?(@downsampled_file_path)
  end

  private

  def read_waveform_buffers
    waveform_buffers = []
    reader = WaveFile::Reader.new(@downsampled_file_path.to_path)
    begin
      num_samples_per_waveform_buffer = (reader.total_sample_frames / DEFAULT_WAVEFORM_LENGTH.to_f)
      uncertainty = num_samples_per_waveform_buffer - num_samples_per_waveform_buffer.to_i
      propagated_uncertainty = 0.0

      while reader.current_sample_frame < reader.total_sample_frames
        num_samples = num_samples_per_waveform_buffer.to_i
        propagated_uncertainty += uncertainty

        if propagated_uncertainty >= 0.999999999
          propagated_uncertainty -= 1
          num_samples += 1
        end

        buffer_samples = reader.read(num_samples).samples
        waveform_buffers << buffer_samples unless buffer_samples.empty?
      end
    ensure
      reader.close
    end

    waveform_buffers
  end
end
