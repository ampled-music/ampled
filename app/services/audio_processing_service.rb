class AudioProcessingService
  class FfmpegError < StandardError; end
  class S3ObjectNotFound < StandardError; end

  def initialize(public_id)
    @public_id = public_id
    @process_id = SecureRandom.uuid
    @raw_file_path = Rails.root.join("tmp/audio/raw_#{@process_id}")

    @s3 = Aws::S3::Resource.new
    object = @s3.bucket(ENV["S3_BUCKET"]).object(public_id)
    raise S3ObjectNotFound unless object.exists?

    # save audio to disk
    object.get(response_target: @raw_file_path)
  end

  # generate SHA256 hash from file
  def generate_hash
    sha256 = Digest::SHA256.file @raw_file_path
    sha256.hexdigest
  end

  # probe file for duration
  def duration
    duration = FFMPEG.probe(@raw_file_path, "duration")
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
  def generate_waveform(waveform_length)
    # process original file
    @downsampled_file_path = Rails.root.join("tmp/audio/downsampled_#{@process_id}.wav")
    FFMPEG.run(@raw_file_path, @downsampled_file_path, "pcm_u8", 1000, 1)

    error_message = "FFMPEG: failed to transcode and downsample audio upload: #{@public_id}"
    raise FfmpegError, error_message unless File.exist?(@downsampled_file_path)

    # read output file buffers
    waveform_buffers = distribute_frames_across_buffers(waveform_length)

    # reduce to one positive amplitude value per waveform buffer
    waveform = []
    waveform_buffers.each do |buffer|
      waveform << buffer.map { |sample| (sample - 128).abs }.max
    end

    return waveform if waveform.empty?

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

  # == Distribute frames across N buffers as evenly as possible
  #
  # example:
  # If the file contains the frames [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  # and we want to distribute frames evenly into 3 different buckets.
  #
  # This method will return
  #   [
  #     [0, 1, 2],      // buffer 1
  #     [3, 4, 5],      // buffer 2
  #     [6, 7, 8, 9],   // buffer 3
  #   ]
  def distribute_frames_across_buffers(buffer_count)
    waveform_buffers = []
    reader = WaveFile::Reader.new(@downsampled_file_path.to_path)
    begin
      num_samples_per_waveform_buffer = (reader.total_sample_frames / buffer_count.to_f)
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
