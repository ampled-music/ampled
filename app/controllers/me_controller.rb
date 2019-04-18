class MeController < ApplicationController
  def index
    if current_user.blank?
      render json: {}
      return
    end
    @owned = current_user.owned_pages.map { |page| OpenStruct.new(id: page.id, role: "owner") }
    @supported = current_user.supported_artists.map { |page| OpenStruct.new(id: page.id, role: "supporter") }
  end
end
