class CommentsController < ApplicationController
  before_action :set_comment, only: %i[destroy]

  def create
    @comment = Comment.new(comment_params)

    if @comment.save
      redirect_to @comment.post.artist_page, notice: "Comment added"
    else
      render :new
    end
  end


  def destroy
    artist_page_id = @comment.post.artist_page.id
    @comment.destroy
    redirect_to artist_page_path(artist_page_id), notice: "Comment removed"
  end

  private

  def comment_params
    params.require(:comment).permit(:text, :post_id).merge(user_id: current_user.id)
  end

  def set_comment
    @comment = Comment.find(params[:id])
  end
end
