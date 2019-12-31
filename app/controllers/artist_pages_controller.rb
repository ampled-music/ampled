class ArtistPagesController < ApplicationController
  before_action :set_artist_page, :set_page_ownership, only: %i[show edit update destroy]

  def index
    @artist_pages = ArtistPage.all

    respond_to do |format|
      format.html
      format.json { render json: @artist_pages }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json
    end
  end

  def new
    @artist_page = ArtistPage.new
  end

  def edit
  end

  def create
    # Only logged-in users who have confirmed their emails may create artist pages.
    if current_user.nil? || current_user.confirmed_at.nil?
      return render json: { status: "error", message: "Confirm your email address first." }
    end

    # TODO
    # - create new users for members, where needed

    @artist_page = ArtistPage.new(artist_page_params)
    @artist_page.owners << current_user

    return render json: { status: "error", message: "Something went wrong." } unless @artist_page.save

    render json: { status: "ok", message: "Your page has been created!" }
  rescue ActiveRecord::RecordNotUnique => e
    Raven.capture_exception(e)
    render json: { status: "error", message: "Someone's already using that custom link." }
  rescue StandardError => e
    Raven.capture_exception(e)
    render json: { status: "error", message: e.message }
  end

  def update
    if @artist_page.update(artist_page_params)
      redirect_to @artist_page, notice: "Artist page was successfully updated."
    else
      render :edit
    end
  end

  def destroy
    @artist_page.destroy
    redirect_to artist_pages_url, notice: "Artist page was successfully destroyed."
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_artist_page
    @artist_page = if params[:slug]
                     ArtistPage.find_by(slug: params[:slug])
                   else
                     ArtistPage.find(params[:id])
                   end
  end

  def set_page_ownership
    @role = PageOwnership.where(user_id: current_user.try(:id), artist_page_id: params[:id]).take.try(:role)
  end

  # Only allow a trusted parameter "white list" through.
  def artist_page_params
    params.require(:artist_page).permit(:name, :bio, :twitter_handle, :instagram_handle, :banner_image_url,
                                        :slug, :location, :accent_color, :video_url, :verb_plural)
  end
end
