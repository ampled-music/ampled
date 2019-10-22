class PostsController < ApplicationController
  before_action :set_post, only: %i[destroy]

  def create
    @post = Post.new(post_params)

    if PostPolicy.new(current_user, @post).create? && @post.save
      SendEmailBatchJob.perform_async(@post.id)
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
