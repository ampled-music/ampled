class BackfillPlanChargeAmount < ActiveRecord::Migration[5.2]
  def up
    Plan.all.each do |plan|
      charge_amount = StripeUtil.charge_amount_for_nominal_amount(plan.nominal_amount)
      plan.update!(charge_amount: charge_amount.fractional)
    end

    change_column_null :plans, :charge_amount, false
  end

  def down
    change_column_null :plans, :charge_amount, true
  end
end
