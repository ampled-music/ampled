class PostPolicy
  attr_reader :user, :post

  def initialize(user, post)
    @user = user
    @post = post
  end

  def create?
    owner?
  end

  def destroy?
    owner? || author?
  end

  def comment?
    subscriber? || owner?
  end

  def update?
    owner? || author?
  end

  def view_details?
    !post.is_private || owner? || (subscriber? && card_valid?)
  end

  private

  def author?
    @post.user == @user
  end

  def owner?
    @user&.owned_pages&.include?(@post.artist_page)
  end

  def subscriber?
    @user&.subscribed?(@post.artist_page)
  end

  def card_valid?
    @user&.card_is_valid?
  end
end
