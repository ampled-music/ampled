class MeController < ApplicationController
  before_action :set_page_ownerships, only: :root

  def root
    render json: {
      userInfo: {
        id: current_user.id,
        name: current_user.name
      },
      artistPages: @page_ownerships
    }
  end

  private

  def set_page_ownerships
    @page_ownerships = User.find(current_user.id).page_ownerships.map do |page|
      { artistId: page.artist_page_id, role: page.role }
    end
  end
end
