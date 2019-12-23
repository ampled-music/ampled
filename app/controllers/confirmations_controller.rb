class ConfirmationsController < Devise::ConfirmationsController
  respond_to :json

  private

  def after_confirmation_path_for(_resource_name, resource)
    sign_in(resource)
    root_path
  end
end
