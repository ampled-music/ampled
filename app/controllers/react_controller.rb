class ReactController < ActionController::Base
  def index
    render file: "public/index.html", layout: false
  end

  def artist_page
    artist_page = ArtistPage.find_by(slug: request[:artist_name])
    return render_404 if artist_page.nil?

    response_html = render_to_string file: "public/index.html", layout: false

    image = artist_page.images.first
    bio = artist_page.bio.gsub(/[\n\r]/, " ")

    # replace title tag and title metas
    response_html.gsub!(/Ampled\s\|\s/, "#{artist_page.name} | Ampled | ")

    # replace description metas
    response_html.gsub!(/content="Ampled allows[^"]+"/, "content=\"#{bio}\"")

    # additional meta tags not already in index.html
    additional_meta = "\n<meta name=\"twitter:card\" content=\"summary_large_image\" />\n \
    <meta name=\"og:type\" content=\"profile\" />\n \
    <meta name=\"og:description\" content=\"#{bio}\" />\n \
    <meta property=\"og:description\" content=\"#{bio}\" />\n"

    # add image if one exists
    unless image.nil?
      additional_meta += "\n<meta property=\"og:image\" content=\"#{image.url}\" />"
      additional_meta += "\n<meta name=\"og:image\" content=\"#{image.url}\" />"
    end
    # add twitter handle if one exists
    if artist_page.twitter_handle.present?
      additional_meta += "\n<meta property=\"twitter:creator\" content=\"@#{artist_page.twitter_handle}\" />"
    end
    response_html.gsub!(/<head>/, "<head>#{additional_meta}")

    render html: response_html.html_safe, content_type: "text/html"
  end

  def render_404
    render file: "public/index.html", layout: false, status: :not_found,
           content_type: "text/html"
  end
end
