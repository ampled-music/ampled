class CreatePlans < ActiveRecord::Migration[5.2]
  def change
    create_table :plans do |t|
      t.integer :amount, null: false
      t.string :stripe_id, null: false
      t.references :artist_page, foreign_key: true, null: false
    end
  end
end
