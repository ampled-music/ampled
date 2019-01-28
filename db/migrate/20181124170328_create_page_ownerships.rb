class CreatePageOwnerships < ActiveRecord::Migration[5.2]
  def change
    create_table :page_ownerships do |t|
      t.integer :user_id
      t.integer :artist_page_id
      t.timestamps

      t.index %i[artist_page_id user_id]
      t.index %i[user_id artist_page_id]
    end
  end
end
