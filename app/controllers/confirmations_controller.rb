class ConfirmationsController < Devise::ConfirmationsController
  respond_to :json

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    # respond_to :html
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    yield resource if block_given?

    if resource.errors.empty?
      set_flash_message!(:notice, :confirmed)
      sign_in(resource_name, resource)
    end

    redirect_to after_confirmation_path_for(resource_name, resource)
  end

  private

  def after_confirmation_path_for(_resource_name, resource)
    sign_in(resource)
    if resource.errors.empty?
      "#{resource.redirect_uri}?flash=confirmed"
    else
      "#{resource.redirect_uri}?flash=confirmerror"
    end
  end
end
