class ArtistPagesController < ApplicationController
  before_action :set_artist_page, :set_page_ownership, only: %i[show edit update destroy]
  before_action :check_approved, only: :show
  before_action :check_user, only: %i[create update]
  before_action :check_has_image, only: :create
  before_action :check_create_okay, only: :create
  before_action :check_update_okay, only: :update

  def index
    @artist_pages = ArtistPage.where(featured: true, approved: true).take(3)

    respond_to do |format|
      format.html do
        redirect_to "/"
      end
      format.json
    end
  end

  def show
    respond_to do |format|
      format.html do
        redirect_to "/artist/#{@artist_page.slug}"
      end
      format.json
    end
  end

  def new
    @artist_page = ArtistPage.new
  end

  def edit
  end

  def create
    # if we used activerecord validations, we could just check ArtistPage.new(...).valid?
    # and if not valid, return @artist_page.errors to give more info about whats wrong
    unless (@artist_page = ArtistPage.create(artist_page_params))
      return render json: { status: "error", message: "Something went wrong." }
    end

    set_members

    set_images

    ArtistPageCreateEmailJob.perform_async(@artist_page.id, current_user.id) unless ENV["REDIS_URL"].nil?

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
      set_images unless has_no_images
      unless has_no_members
        @artist_page.owners.clear
        set_members
      end
      render json: { status: "ok", message: "Your page has been updated!" }
    else
      render json: { status: "error", message: "Something went wrong." }
    end
  end

  def destroy
    unless @role == "admin" || current_user&.admin?
      return render json: { status: "error", message: "You don't have that permission." }
    end

    render json: { status: "ok", message: "Your page has been deleted!" } if @artist_page.destroy
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

  def check_user
    return render json: { status: "error", message: "Confirm your email address first." } if current_user.nil?

    # Pull user from DB in case they've confirmed recently.
    # BA - Was this actually a problem? Could we current_user.reload at the top of the method instead?
    user = User.find_by(id: current_user&.id)
    # Only logged-in users who have confirmed their emails may create artist pages.
    render json: { status: "error", message: "Please confirm your email address first." } if user&.confirmed_at.nil?
  end

  def missing_params_error
    render json: { status: "error", message: "Missing required parameters." }
  end

  def missing_members_error
    render json: { status: "error", message: "You need at least one member." }
  end

  def has_no_members
    params[:members].nil? || params[:members][0].nil?
  end

  def has_no_images
    params[:images].nil? || params[:images][0].nil?
  end

  def check_has_image
    render json: { status: "error", message: "You need at least a main image." } if has_no_images
  end

  def missing_create_params
    artist_page_params[:name].nil? || artist_page_params[:slug].nil? || artist_page_params[:bio].nil? || \
      artist_page_params[:location].nil? || artist_page_params[:accent_color].nil?
  end

  def check_create_okay
    # required params
    # could we use active record validations here instead?
    return unless missing_create_params || has_no_images || has_no_members

    if has_no_members
      missing_members_error
    else
      missing_params_error
    end
  end

  def check_update_okay
    unless @role == "admin" || current_user&.admin?
      return render json: { status: "error", message: "You don't have that permission." }
    end

    # could we just have an update_params method similar to artist_page_params ?
    return if artist_page_params[:slug].nil? && artist_page_params[:name].nil?

    render json: {
      status: "error",
      message: "You can't change your URL or name."
    }
  end

  def check_approved
    return if @artist_page&.approved? || current_user&.admin?

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
    params[:members].map do |member|
      member_user = User.find_by(email: member[:email])
      new_member = false
      if member_user.nil?
        new_member = true
        member_user = create_member(member)
      end

      @artist_page.owners << member_user
      PageOwnership.find_by(user_id: member_user[:id],
                            artist_page_id: @artist_page[:id]).update(instrument: member[:role],
                                                                      role: member[:isAdmin] ? "admin" : "member")

      # Skip emails if we're not in an environment where they work.
      next if ENV["REDIS_URL"].nil?

      if new_member
        ArtistPageMemberCreatedJob.perform_async(@artist_page.id, member_user.id, current_user.id)
      elsif member_user.id != current_user.id
        ArtistPageMemberAddedJob.perform_async(@artist_page.id, member_user.id, current_user.id)
      end
    end
    @artist_page.save
  end

  def create_member(member)
    member_user = User.new(email: member[:email],
                           name: member[:firstName],
                           last_name: member[:lastName],
                           redirect_uri: "/reset-password",
                           password: (0...8).map { rand(65..91).chr }.join)
    member_user.skip_confirmation_notification!
    member_user.save!
    member_user
  end

  def set_images
    # - create new images based on uploads
    @artist_page.images.destroy_all

    params[:images].map do |image_url|
      @artist_page.images.create(url: image_url)
    end
  end
end
