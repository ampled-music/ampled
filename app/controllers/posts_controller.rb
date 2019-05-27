class PostsController < ApplicationController
  before_action :set_post, only: %i[destroy]
  respond_to :json

  def create
    @post = Post.new(post_params)

    if @post.save
      render json: { status: 200 }
    else
      render json: { status: 400, errors: @post.errors }
    end
  end

  def destroy
    artist_page_id = @post.artist_page.id
    @post.destroy
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
end
