class ReactController < ActionController::Base
  def index
    render file: "public/index.html", layout: false
  end

  def artist_page
    artist_page = ArtistPage.find_by(slug: request[:artist_name])
    return render file: "public/index.html", layout: false if artist_page.nil?

    response_html = render_to_string file: "public/index.html", layout: false

    image = artist_page.images.first

    # replace title tag and title metas
    response_html.gsub!(/Ampled\s\|\s/, "#{artist_page.name} | Ampled | ")

    # replace description metas
    response_html.gsub!(/content="Ampled allows[^"]+"/, "content=\"#{artist_page.bio}\"")

    # additional meta tags not already in index.html
    additional_meta = "\n<meta name=\"twitter:card\" content=\"summary_large_image\" /> \
    \n<meta name=\"og:description\" content=\"#{artist_page.bio}\" />"
    # add image if one exists
    additional_meta += "\n<meta property=\"og:image\" content=\"#{image.url}\" />" unless image.nil?
    # add twitter handle if one exists
    unless artist_page.twitter_handle.blank?
      additional_meta += "\n<meta property=\"twitter:creator\" content=\"@#{artist_page.twitter_handle}\" />"
    end
    response_html.gsub! "<meta charset=\"utf-8\" />", "<meta charset=\"utf-8\" />#{additional_meta}"

    render html: response_html.html_safe, content_type: "text/html"
  end

  def render_404
    render file: "public/index.html", layout: false, status: :not_found,
           content_type: "text/html"
  end
end
