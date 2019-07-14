class PostsController < ApplicationController
  before_action :set_post, only: %i[destroy]

  def create
    @post = Post.new(post_params)

    if PostPolicy.new(current_user, @post).create? && @post.save
      render json: :ok
    else
      render json: {}, status: :bad_request
    end
  end

  def destroy
    if PostPolicy.new(current_user, @post).destroy? && @post.destroy
      render json: :ok
    else
      render json: {}, status: :bad_request
    end
  end

  def edit
    artist_page_id = @Post.artist_page.id
    @post.update(post_update_params)
    200
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

  def post_update_params
    params.require(:post).permit(
      :title,
      :body,
      :image_url,
      :audio_file,
      :is_private
    )
end
