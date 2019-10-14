class RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def update
    current_user.update(user_params)
    render_resource(current_user)
  end

  def create
    build_resource(sign_up_params)

    resource.save
    FanWelcomeMailer.fan_welcome(resource).deliver_later
    
    render_resource(resource)
  end

  private

  def user_params
    params.permit(:profile_image_url, :name, :last_name, :city, :country, :twitter, :instagram, :bio,
                  :ship_address, :ship_address2, :ship_city, :ship_state, :ship_country, :ship_zip)
  end
end
