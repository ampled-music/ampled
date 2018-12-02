class SubscriptionsController < ApplicationController
  # before_action :set_artist_page, only: %i[show edit update destroy]

  def index
    @subscriptions = current_user.subscriptions
  end

  def show
  end

  def new
    @artist_page = ArtistPage.new
  end

  def edit
  end

  def create

    @subscription = Subscription.new(subscription_params)

    if @subscription.save
      redirect_to @subscription.artist_page, notice: "Subscribed to #{@subscription.artist_page.name}!"
    else
      render :new
    end
  end

  def update
    #if @subscription.update(subscription_params)
    #  redirect_to @artist_page, notice: "Artist page was successfully updated."
    #else
    #  render :edit
    #end
  end

  def destroy
    #@.destroy
    #redirect_to artist_pages_url, notice: "Artist page was successfully destroyed."
  end

  private

  # Only allow a trusted parameter "white list" through.
  def subscription_params
    params.require(:subscription).permit(:artist_page_id).merge(user_id: current_user.id)
  end
end
