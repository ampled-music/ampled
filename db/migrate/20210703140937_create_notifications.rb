class CreateNotifications < ActiveRecord::Migration[5.2]
  def change
    create_table :notifications do |t|
      t.string :link
      t.text :text
      t.boolean :is_unread, default: true, null: false
      t.references :user, foreign_key: true, null: false

      t.timestamps
    end
  end
end
