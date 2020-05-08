# == Schema Information
#
# Table name: audio_uploads
#
#  created_at :datetime         not null
#  duration   :integer
#  hashKey    :string
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
  before_destroy :delete_audio
  before_create :set_waveform

  class WaveformEmptyError < StandardError; end

  def delete_audio
    s3 = Aws::S3::Resource.new
    bucket = s3.bucket(ENV["S3_BUCKET"])
    bucket.object(public_id).delete
  end

  def set_waveform 
    audio_processing_service = AudioProcessingService.new(public_id)
    begin
      self.waveform = audio_processing_service.generate_waveform
      raise WaveformEmptyError, "Unable to generate waveform for audio upload with id: #{id}" if self.waveform.empty?
    ensure
      audio_processing_service.dispose
    end
  end
end
