class CreateAudioUploads < ActiveRecord::Migration[5.2]
  def change
    create_table :audio_uploads do |t|
      t.references :post, null: false, foreign_key: true, index: true
      t.string :public_id, null: false, unique: true
      t.string :hash_key, unique: true
      t.string :name
      t.integer :duration
      t.integer :waveform, array: true, null: false, default: []
      t.timestamps
    end
  end
end
