class AudioProcessingJob
  include Sidekiq::Worker

  class AudioUploadNotFoundError < StandardError; end
  class WaveformEmptyError < StandardError; end
  
  def perform(audio_upload_id)
    audio_upload = AudioUpload.find(audio_upload_id)
    raise AudioUploadNotFoundError, "Could not find audio upload with id: #{audio_upload_id}" if audio_upload.blank?
    return if audio_upload.processed?

    audio_processing_service = AudioProcessingService.new(audio_upload.public_id)
    begin
      if audio_upload.waveform.empty? 
        waveform = audio_processing_service.generate_waveform
        raise WaveformEmptyError, "Waveform is empty for audio upload with id: #{audio_upload_id}" if waveform.empty?

        audio_upload.update(waveform: waveform)
      end
    ensure
      audio_processing_service.dispose
    end
  end
end
