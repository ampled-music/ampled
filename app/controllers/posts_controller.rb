class PostsController < ApplicationController
  before_action :set_post, only: %i[destroy update show]
  before_action :is_admin, only: :index

  def create
    @post = Post.new(post_params)
    if PostPolicy.new(current_user, @post).create? && @post.save
      PostNotificationJob.perform_async(@post.id)
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

  def show
    respond_to :json
  end

  def download_post
    @post = Post.find(params[:postid])

    return render html: "", status: :not_found unless @post.has_audio

    unless PostPolicy.new(current_user, @post).view_details? && @post.allow_download
      return render html: "", status: :not_found
    end

    @signer ||= Aws::S3::Presigner.new
    redirect_to @signer.presigned_url(:get_object, bucket: ENV["S3_BUCKET"],
                                      key: @post.audio_uploads.first.public_id,
                                      response_content_disposition: "attachment; filename=\"#{@post.title}.mp3\"")
  end

  def index
    @expand_artist = true
    @posts = Post.order("created_at DESC").page(params[:page]).per(30)
  end

  def is_admin
    return render json: [] unless PostPolicy.new(current_user, nil).view_all?
  end

  private

  def post_params
    Image.rename_params(params, :post)
    AudioUpload.rename_params(params, :post)
    params.require(:post).permit(
      :title,
      :body,
      :post_type,
      :artist_page_id,
      :image_url,
      :audio_file,
      :is_private,
      :allow_download,
      :video_embed_url,
      images_attributes: Image::PERMITTED_PARAMS,
      audio_uploads_attributes: %i[name public_id id]
    ).merge(user_id: current_user&.id)
  end

  def set_post
    @post = Post.find(params[:id])
  end

  def post_update_params
    Image.rename_params(params, :post)
    AudioUpload.rename_params(params, :post)
    params.require(:post).permit(
      :title,
      :body,
      :post_type,
      :image_url,
      :audio_file,
      :is_private,
      :allow_download,
      :video_embed_url,
      images_attributes: Image::PERMITTED_PARAMS,
      audio_uploads_attributes: %i[name public_id id _destroy]
    )
  end
end
