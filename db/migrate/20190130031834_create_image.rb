class CreateImage < ActiveRecord::Migration[5.2]
  def change
    create_table :images do |t|
      t.string :url
      t.integer :order
      t.references :artist_page, index: true

      t.timestamps
    end
  end
end
q