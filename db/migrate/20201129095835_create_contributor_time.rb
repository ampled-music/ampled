class CreateContributorTime < ActiveRecord::Migration[5.2]
  def change
    create_table :contributor_time do |t|
      t.references :contributor, foreign_key: true
      t.date :started_on
      t.date :ended_on
      t.float :hours
      t.text :notes

      t.timestamps
    end
  end
end
