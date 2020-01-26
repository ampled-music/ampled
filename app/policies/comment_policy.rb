class CommentPolicy
  attr_reader :user, :post, :comment

  def initialize(user:, comment:)
    @user = user
    @post = comment.post
    @comment = comment
  end

  def create?
    owner? || admin? || subscriber?
  end

  def destroy?
    commenter? || owner? || admin?
  end

  private

  def commenter?
    @comment.user == @user
  end

  def admin?
    @user&.admin?
  end

  def owner?
    @user&.owned_pages&.include?(@post.artist_page)
  end

  def subscriber?
    @user&.subscribed?(@post.artist_page)
  end
end
