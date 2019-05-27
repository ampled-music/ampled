class CommentsController < ApplicationController
  before_action :set_comment, only: %i[destroy]
  respond_to :json

  def create
    @comment = Comment.new(comment_params)

    if @comment.save
      render json: { status: 200 }
    else
      render json: { status: 400, errors: @comment.errors }
    end
  end

  def destroy
    @comment.destroy
    200
  end

  private

  def comment_params
    params.require(:comment).permit(:text, :post_id).merge(user_id: current_user.id)
  end

  def set_comment
    @comment = Comment.find(params[:id])
  end
end
