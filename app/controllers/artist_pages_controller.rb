class ArtistPagesController < ApplicationController
  before_action :set_artist_page, :set_page_ownership, only: %i[show edit update destroy]
  before_action :check_approved, only: :show
  before_action :check_create_okay, only: :create

  def index
    @artist_pages = ArtistPage.where(featured: true)

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
    unless (@artist_page = ArtistPage.create(artist_page_params))
      return render json: { status: "error", message: "Something went wrong." }
    end

    set_members

    set_images

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

  def check_create_okay
    # Pull user from DB in case they've confirmed recently.
    user = User.find_by(id: current_user&.id)
    # Only logged-in users who have confirmed their emails may create artist pages.
    if current_user.nil? || user&.confirmed_at.nil?
      render json: { status: "error", message: "Confirm your email address first." }
    elsif artist_page_params[:name].nil? || artist_page_params[:slug].nil?
      render json: { status: "error", message: "Missing required parameters." }
    end
  end

  def check_approved
    return if @artist_page.approved? || current_user&.admin?

    render json: {}, status: :bad_request unless current_user&.owned_pages&.include?(@artist_page)
  end

  # Only allow a trusted parameter "white list" through.
  def artist_page_params
    params.require(:artist_page).permit(:name, :bio, :twitter_handle, :instagram_handle, :banner_image_url,
                                        :slug, :location, :accent_color, :video_url, :verb_plural, :images,
                                        :members)
  end

  # Helper functions for creating / updating an artist page.
  def set_members
    params[:members].map.with_index do |member, index|
      member_user = if index.zero?
                      current_user
                    else
                      User.find_by(email: member[:email]) ||
                        User.create(email: member[:email],
                                    name: member[:firstName],
                                    password: (0...8).map { rand(65..91).chr }.join)
                    end
      @artist_page.owners << member_user
      PageOwnership.find_by(user_id: member_user[:id],
                            artist_page_id: @artist_page[:id]).update(instrument: member[:role],
                                                                      role: member[:isAdmin] ? "admin" : "member")
    end
    @artist_page.save
  end

  def set_images
    # - create new images based on uploads
    params[:images].map.with_index do |image_url, index|
      @artist_page.images.create(url: image_url, order: index)
    end
  end
end
