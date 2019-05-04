class RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def update
    current_user.update(user_params)
    render_resource(current_user)
  end

  def create
    build_resource(sign_up_params)

    resource.save
    render_resource(resource)
  end

  private

  def user_params
    params.permit(:profile_image_url)
  end
end
