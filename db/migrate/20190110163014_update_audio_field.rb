class UpdateAudioField < ActiveRecord::Migration[5.2]
  def change
    remove_attachment :posts, :audio_file
    add_column :posts, :audio_file, :string
  end
end
