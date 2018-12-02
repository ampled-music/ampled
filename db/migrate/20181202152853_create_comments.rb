class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments do |t|
      t.references :post, foreign_key: true, index: true
      t.references :user, foreign_key: true, index: true
      t.text :text

      t.timestamps
    end
  end
end
