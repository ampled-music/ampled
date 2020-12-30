class AddTotalContributionsToPlans < ActiveRecord::Migration[5.2]
  def up
    add_column :plans, :total_contributions, :integer, default: 0
  end

  def down
    remove_column :plans, :total_contributions
  end
end
