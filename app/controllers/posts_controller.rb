class PostsController < ApplicationController
  before_action :set_post, only: %i[destroy update]

  def create
    @post = Post.new(post_params)
    if PostPolicy.new(current_user, @post).create? && @post.save
      PostNotificationEmailJob.perform_async(@post.id) unless ENV["REDIS_URL"].nil?
      render json: :ok
    else
      render json: { errors: @post.errors }, status: :bad_request
    end
  end

  def destroy
    if PostPolicy.new(current_user, @post).destroy? && @post.destroy
      render json: :ok
    else
      render json: {}, status: :bad_request
    end
  end

  def update
    if PostPolicy.new(current_user, @post).update? && @post.update(post_update_params)
      render json: :ok
    else
      render json: { errors: @post.errors }, status: :bad_request
    end
  end

  private

  def rename_images_params
    return unless params[:post]&.include?(:images)

    # Let frontend use 'images' as parameter name, which is more natural. We change it here
    # to be the images_attributes that ActiveRecord's nested attributes expect.
    params[:post][:images_attributes] = params[:post][:images]
  end

  def post_params
    rename_images_params
    params.require(:post).permit(
      :title,
      :body,
      :artist_page_id,
      :audio_file,
      :is_private,
      images_attributes: Image::PERMITTED_PARAMS
    ).merge(user_id: current_user&.id)
  end

  def set_post
    @post = Post.find(params[:id])
  end

  def post_update_params
    rename_images_params
    params.require(:post).permit(
      :title,
      :body,
      :audio_file,
      :is_private,
      images_attributes: Image::PERMITTED_PARAMS
    )
  end
end
