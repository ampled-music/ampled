class MeController < ApplicationController
  def index
    @owned_pages = current_user&.owned_pages&.map { |page| OpenStruct.new(id: page.id, image: page.banner_image_url, name: page.name) }
    @owned = current_user&.owned_pages&.map { |page| OpenStruct.new(id: page.id, role: "owner") }
    @supported = current_user&.supported_artists&.map { |page| OpenStruct.new(id: page.id, role: "supporter") }
    @subscriptions = current_user&.subscriptions
  end
end
