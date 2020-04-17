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

  def download_post
    @post = Post.find(params[:postid])

    return render html: "", status: :not_found unless @post.has_audio

    unless PostPolicy.new(current_user, @post).view_details? && @post.allow_download
      return render html: "", status: :not_found
    end

    @signer ||= Aws::S3::Presigner.new
    redirect_to @signer.presigned_url(:get_object, bucket: ENV["S3_BUCKET"],
                                      key: @post.audio_file,
                                      response_content_disposition: "attachment; filename=\"#{@post.title}.mp3\"")
  end

  private

  def post_params
    params.require(:post).permit(
      :title,
      :body,
      :artist_page_id,
      :image_url,
      :audio_file,
      :is_private,
      :allow_download,
      :video_embed_url
    ).merge(user_id: current_user&.id)
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
      :is_private,
      :allow_download,
      :video_embed_url
    )
  end
end
