class ConfirmationsController < Devise::ConfirmationsController
  def show
    super do |resource|
      sign_in(resource) if resource.errors.empty?
    end
  end

  private

  def after_confirmation_path_for(_resource_name, resource)
    sign_in(resource)
    root_path
  end
end
