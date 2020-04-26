# == Schema Information
#
# Table name: audio_uploads
#
#  created_at :datetime         not null
#  id         :bigint(8)        not null, primary key
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

FactoryBot.define do
  factory :audio_upload do
  end
end
