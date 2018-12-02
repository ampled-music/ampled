class CommentsController < ApplicationController
  #before_action :set_artist_page, only: %i[show edit update destroy]

  def create
    @comment = Comment.new(comment_params)

    if @comment.save
      redirect_to @comment.post.artist_page, notice: "Comment added"
    else
      render :new
    end
  end


  def destroy
    post = @comment.post.artist_page
    @comment.destroy
    redirect_to post, notice: "Comment removed"
  end

  private

  def comment_params
    params.require(:comment).permit(:text, :post_id).merge(user_id: current_user.id)
  end
end
