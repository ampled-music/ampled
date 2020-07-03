class StatsController < ApplicationController
  def summary
    @active_subscription_count = active_subscription_count
    @avg_subscription_amount = format_value(avg_subscription_amount_value)
    @total_revenue = format_value(total_revenue_value)

    render template: "stats/summary"
  end

  private

  def format_value(value)
    format("$%.2f", value / 100.0)
  end

  def active_subscription_count
    @active_subscription_count ||= Subscription.active.count
  end

  def avg_subscription_amount_value
    @avg_subscription_amount_value ||= begin
      active_subscription_count.zero? ? 0 : total_revenue_value / active_subscription_count
    end
  end

  def total_revenue_value
    @total_revenue_value ||= begin
      Subscription.includes(:plan).active.reduce(0) do |sum, subscription|
        sum + subscription.plan.nominal_amount
      end
    end
  end
end
