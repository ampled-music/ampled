# == Schema Information
#
# Table name: audio_uploads
#
#  created_at :datetime         not null
#  id         :bigint(8)        not null, primary key
#  post_id    :bigint(8)        not null
#  public_id  :string           not null
#  updated_at :datetime         not null
#  waveform   :text             default([]), not null, is an Array
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
  before_destroy :delete_from_s3

  def delete_from_s3
    s3 = Aws::S3::Resource.new
    bucket = s3.bucket(ENV["S3_BUCKET"])
    bucket.object(public_id).delete
  end
end
