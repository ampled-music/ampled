class CommentsController < ApplicationController
  before_action :set_comment, only: %i[destroy]

  def create
    @comment = Comment.new(comment_params)

    if policy.create? && @comment.save
      redirect_to @comment.post.artist_page, notice: "Comment added"
    else
      render_not_allowed
    end
  end

  def destroy
    if policy.destroy? && @comment.destroy
      200
    else
      render_not_allowed
    end
  end

  private

  def policy
    CommentPolicy.new(user: current_user, comment: @comment)
  end

  def render_not_allowed
    render json: { status: "error", message: "Not allowed." }
  end

  def comment_params
    params.require(:comment).permit(:text, :post_id).merge(user_id: current_user.id)
  end

  def set_comment
    @comment = Comment.find(params[:id])
  end
end
