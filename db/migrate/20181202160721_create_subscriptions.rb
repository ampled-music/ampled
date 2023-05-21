class CreateSubscriptions < ActiveRecord::Migration[5.2]
  def change
    create_table :subscriptions do |t|
      t.references :artist_page, foreign_key: true, index: true
      t.references :user, foreign_key: true, index: true

      # t.timestamp :
    end
  end
end
