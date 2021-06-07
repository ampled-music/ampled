# == Schema Information
#
# Table name: audio_uploads
#
#  created_at :datetime         not null
#  duration   :integer
#  hash_key   :string
#  id         :bigint(8)        not null, primary key
#  name       :string
#  post_id    :bigint(8)        not null
#  public_id  :string           not null
#  updated_at :datetime         not null
#  waveform   :integer          default([]), not null, is an Array
#
# Indexes
#
#  index_audio_uploads_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#

class AudioUpload < ApplicationRecord
  DEFAULT_WAVEFORM_LENGTH = 1000

  before_destroy :delete_audio
  before_create :process_audio
  after_find :ensure_waveform

  class HashGenerationError < StandardError; end

  class DurationNotFoundError < StandardError; end

  class WaveformEmptyError < StandardError; end

  def delete_audio
    s3 = Aws::S3::Resource.new
    bucket = s3.bucket(ENV["S3_BUCKET"])
    bucket.object(public_id).delete
  end

  class << self
    # If the given parameters contain an 'audio_uploads' key, copies the contents to an 'audio_uploads_attributes'
    # key. This allows APIs for nested image attributes to accept the attributes through the more natural
    # 'audio_uploads' key, while allowing us to use Rails' nested attributes support.
    #
    # @param [ActionController::Parameters]
    # @param [Symbol] The key that we expect to contain audio_uploads attribute.
    # @return [ActionController::Parameters] The modified parameters (which are also modified in-place).
    def rename_params(params, object_key)
      return params unless params[object_key]&.include?(:audio_uploads)

      params[object_key][:audio_uploads_attributes] = params[object_key][:audio_uploads]
      params
    end
  end

  private

  def ensure_waveform
    return if waveform.length == DEFAULT_WAVEFORM_LENGTH

    audio_processing_service = nil
    begin
      audio_processing_service = AudioProcessingService.new(public_id)

      self.waveform = audio_processing_service.generate_waveform(DEFAULT_WAVEFORM_LENGTH)
      waveform.empty? && (raise WaveformEmptyError, "Unable to generate waveform for audio upload with id: #{id}")
      save!
    rescue AudioProcessingService::S3ObjectNotFound => e
      Raven.capture_exception(e)
    ensure
      audio_processing_service&.dispose
    end
  end

  def process_audio
    audio_processing_service = nil
    begin
      audio_processing_service = AudioProcessingService.new(public_id)

      self.hash_key = audio_processing_service.generate_hash
      hash_key.empty? && (raise HashGenerationError, "Unable to generate sha256 hash for audio upload with id: #{id}")

      self.duration = audio_processing_service.duration
      duration <= 0 && (raise DurationNotFoundError, "Unable to get duration for audio upload with id: #{id}")

      self.waveform = audio_processing_service.generate_waveform(DEFAULT_WAVEFORM_LENGTH)
      waveform.empty? && (raise WaveformEmptyError, "Unable to generate waveform for audio upload with id: #{id}")
    rescue AudioProcessingService::S3ObjectNotFound => e
      Raven.capture_exception(e)
    ensure
      audio_processing_service&.dispose
    end
  end
end
