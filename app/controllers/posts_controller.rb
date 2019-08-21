class PostsController < ApplicationController
  before_action :set_post, only: %i[destroy]

  def create
    @post = Post.new(post_params)

    if @post.save
      redirect_to @post.artist_page, notice: "Post added"
    else
      render :new
    end
  end

  def destroy
    # artist_page_id = @post.artist_page.id
    @post.destroy
    200
    # redirect_to artist_page_path(artist_page_id), notice: "Post removed"
  end

  private

  def post_params
    params.require(:post).permit(
      :title,
      :body,
      :artist_page_id,
      :image_url,
      :audio_file,
      :is_private
    ).merge(user_id: current_user.id)
  end

  def set_post
    @post = Post.find(params[:id])
  end
end
