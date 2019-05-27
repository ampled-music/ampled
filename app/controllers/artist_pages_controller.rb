class ArtistPagesController < ApplicationController
  before_action :set_artist_page, :set_page_ownership, only: %i[show edit update destroy]
  respond_to :json

  def index
    @artist_pages = ArtistPage.all
    render json: @artist_pages
  end

  def show
  end

  def edit
  end

  def create
  end

  def update
  end

  def destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_artist_page
    @artist_page = ArtistPage.find(params[:id])
  end

  def set_page_ownership
    @role = PageOwnership.where(user_id: current_user.try(:id), artist_page_id: params[:id]).take.try(:role)
  end

  # Only allow a trusted parameter "white list" through.
  def artist_page_params
    params.require(:artist_page).permit(:name, :bio, :twitter_handle, :instagram_handle, :banner_image_url)
  end
end
