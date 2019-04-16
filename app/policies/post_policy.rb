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
    owner?
  end

  def comment?
    subscriber? || owner?
  end

  def view_details?
    !post.is_private || owner? || subscriber?
  end

  private

  def owner?
    @user.owned_pages.include?(@post.artist_page)
  end

  def subscriber?
    @user.subscribed?(@post.artist_page)
  end
end
