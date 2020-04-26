class AudioProcessingService
  class FfmpegError < StandardError; end

  def initialize(public_id)
    @public_id = public_id
    @process_id = SecureRandom.uuid
    @raw_file_path = Rails.root.join("tmp/audio/raw_#{@process_id}")
    @s3 = Aws::S3::Resource.new
    @s3.bucket(ENV["S3_BUCKET"]).object(public_id).get(response_target: @raw_file_path)
  end

  def generate_waveform
    @downsampled_file_path = Rails.root.join("tmp/audio/downsampled_#{@process_id}.wav")
    ffmpeg_result = `ffmpeg -i #{@raw_file_path} -acodec pcm_u8 -ar 1000 -ac 1 #{@downsampled_file_path}`
    raise FfmpegError, "FFMPEG: failed to transcode and downsample audio upload: #{public_id}" unless File.exist?(@downsampled_file_path)

    buffers = []
    reader = WaveFile::Reader.new(@downsampled_file_path.to_path)

    begin
      waveform_length = 200
      num_samples_per_buffer = (reader.total_sample_frames / waveform_length.to_f).ceil
      while reader.current_sample_frame < reader.total_sample_frames do
        samples = reader.read(num_samples_per_buffer).samples
        buffers << samples unless samples.empty?
      end
    ensure
      reader.close
    end
    
    waveform = []
    for i in 0..(buffers.size-1)
      samples = buffers[i]
      samples = samples.map{ |sample| (sample - 128).abs }
      waveform << samples.max
    end

    waveform
  end

  def dispose
    File.delete(@raw_file_path) if File.exist?(@raw_file_path)
    File.delete(@downsampled_file_path) if File.exist?(@downsampled_file_path)
  end
end
