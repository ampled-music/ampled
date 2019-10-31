class ReactController < ActionController::Base
  def index
    render file: "public/index.html", layout: false
  end

  def render_404
    render file: "public/index.html", layout: false, status: :not_found
  end
end
