class PagesController < ApplicationController
  layout "empty"
  def root
  end

  def stripe
    @current_user = User.where(email: "benton.anderson@gmail.com").first
  end
end
