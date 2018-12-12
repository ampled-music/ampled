class AddAttachmentAudioFileToPosts < ActiveRecord::Migration[5.2]
  def self.up
    change_table :posts do |t|
      t.attachment :audio_file
    end
  end

  def self.down
    remove_attachment :posts, :audio_file
  end
end
