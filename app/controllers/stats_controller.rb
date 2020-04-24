class StatsController < ApplicationController
  before_action :authenticate_user!
  before_action :allow_admin

  def summary
    @total_revenue = Subscription.joins(:plan).active.reduce(0) do |sum, subscription|
      sum + subscription.plan.nominal_amount
    end
    @total_revenue = format("$%.2f", @total_revenue / 100.0)

    render template: "stats/summary"
  end

  def allow_admin
    return render_not_allowed unless current_user&.admin?
  end

  def render_not_allowed
    render json: { status: "error", message: "Not allowed." }
  end
end
