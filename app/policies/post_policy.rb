class PostPolicy
  attr_reader :user, :post

  def initialize(user, post)
    @user = user
    @post = post
  end

  def create?
    owner? || admin?
  end

  def destroy?
    page_admin? || author? || admin?
  end

  def comment?
    subscriber? || owner? || admin?
  end

  def update?
    page_admin? || author? || admin?
  end

  def view_details?
    !post.is_private || owner? || (subscriber? && card_valid?) || admin?
  end

  private

  def author?
    @post.user == @user
  end

  def admin?
    @user&.admin?
  end

  def owner?
    @user&.owned_pages&.include?(@post.artist_page)
  end

  def page_admin?
    PageOwnership.find_by(user_id: @user[:id], artist_page_id: @post.artist_page.id)&.role == "admin"
  end

  def subscriber?
    @user&.subscribed?(@post.artist_page)
  end

  def card_valid?
    @user&.card_is_valid?
  end
end
