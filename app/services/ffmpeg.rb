class FFMPEG
  def self.probe(file_path, section)
    `ffprobe -i #{file_path} -show_entries format=#{section} -v quiet -of csv="p=0"`
  end

  def self.run(input_file_path, output_file_path, pcm_format = nil, sample_rate = nil, channels = nil)
    command = "ffmpeg -i #{input_file_path} "
    command += "-acodec #{pcm_format} " unless pcm_format.nil?
    command += "-ar #{sample_rate} " unless sample_rate.nil?
    command += "-ac #{channels} " unless channels.nil?
    command += output_file_path.to_s

    # exec
    `#{command}`
  end
end
