class NotificationPolicy
  attr_reader :user, :notification

  def initialize(user:, notification:)
    @user = user
    @notification = notification
  end

  def modify?
    belongs? || admin?
  end

  private

  def belongs?
    @notification.user == @user
  end

  def admin?
    @user&.admin?
  end
end
