class CreateContributors < ActiveRecord::Migration[5.2]
  def change
    create_table :contributors do |t|
      t.references :user, foreign_key: true
      t.date :joined_on
      t.date :worker_owner_on
      t.date :inactive_on

      t.timestamps
    end
  end
end
