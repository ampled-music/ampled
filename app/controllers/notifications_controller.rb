class NotificationsController < ApplicationController
  before_action :set_notification, only: %i[destroy mark_as_read]

  def index
    @notifications = current_user&.unread_notifications
  end

  def destroy
    if policy.modify? && @notification.destroy
      200
    else
      render_not_allowed
    end
  end

  def mark_as_read
    if policy.modify? && @notification.read!
      200
    else
      render_not_allowed
    end
  end

  private

  def policy
    NotificationPolicy.new(user: current_user, notification: @notification)
  end

  def render_not_allowed
    render json: { status: "error", message: "Not allowed." }
  end

  def set_notification
    @notification = Notification.find(params[:id])
  end
end
