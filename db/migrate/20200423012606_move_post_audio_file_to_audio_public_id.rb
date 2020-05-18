class MovePostAudioFileToAudioPublicId < ActiveRecord::Migration[5.2]
  # move the audio_file string from post table and create a new audio_upload
  # record with that value.
  def up 
    Post.where.not(audio_file: nil).each do |post| 
      next unless post.audio_file.present?
      post.audio_uploads << AudioUpload.new(public_id: post.audio_file)
      post.save!
    end
    remove_column :posts, :audio_file
  end

  def down
    add_column :posts, :audio_file, :string
    Post.all.each do |post|
      next unless post.audio_uploads.any?
      post.audio_file = post.audio_upload.first.public_id
      post.save!
    end
  end
end
