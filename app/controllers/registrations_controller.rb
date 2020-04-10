class RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def update
    current_user.update(user_params)
    render_resource(current_user)
  end

  def create
    build_resource(sign_up_params)

    FanWelcomeMailer.fan_welcome(resource).deliver_later if resource.save

    render_resource(resource)
  end

  def update_password
    puts password_params
    current_user.update_with_password(password_params)
    render_resource(current_user)
  end


  private

  def build_resource(*args)
    super

    @user.skip_confirmation_notification!
  end

  def user_params
    params.permit(:profile_image_url, :name, :last_name, :city, :country, :twitter, :instagram, :bio,
                  :ship_address, :ship_address2, :ship_city, :ship_state, :ship_country, :ship_zip,
                  :email)
  end

  def password_params
    params.require(:user).permit(:current_password, :password, :password_confirmation)
  end
end
