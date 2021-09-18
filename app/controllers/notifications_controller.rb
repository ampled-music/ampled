class NotificationsController < ApplicationController
  before_action :set_notification, only: %i[destroy mark_as_read]
  before_action :check_ownership, only: %i[destroy mark_as_read]

  def index
    @notifications = current_user&.unread_notifications
  end

  def destroy
    @notification.destroy
    head(:ok)
  end

  def mark_as_read
    @notification.read!
    head(:ok)
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

  def check_ownership
    return if can_modify_notification?

    render_not_allowed
  end

  def can_modify_notification?
    current_user&.admin? || current_user&.id == @notification.user_id
  end
end
