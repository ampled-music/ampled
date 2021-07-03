class CreateNotifications < ActiveRecord::Migration[5.2]
  def change
    create_table :notifications do |t|
      t.string :link
      t.text :text
      t.boolean :is_unread, default: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
