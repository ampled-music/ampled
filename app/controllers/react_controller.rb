class ReactController < ActionController::Base
  def index
    render file: "public/index.html", layout: false
  end

  def render_404
    puts params[:path]
    render file: "public/index.html", layout: false, :status => 404
  end
end
