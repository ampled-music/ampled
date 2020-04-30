class ReactController < ActionController::Base
  def index
    render file: "public/index.html", layout: false
  end

  def artist_page
    artist_page = ArtistPage.find_by(slug: request[:artist_name])
    return render_404 if artist_page.nil?

    response_html = render_to_string file: "public/index.html", layout: false

    social_image = CloudinaryImageHelper.facebook_share_image(artist_page)

    # replace title tag and title metas
    response_html.gsub!(/Ampled\s\|\s/, "#{artist_page.name} | Ampled | ")

    # replace description metas
    response_html.gsub!(/content="Ampled allows[^"]+"/, "content=\"#{artist_page.bio}\"")

    # additional meta tags not already in index.html
    additional_meta = "\n<meta name=\"twitter:card\" content=\"summary_large_image\" /> \
    \n<meta name=\"og:description\" content=\"#{artist_page.bio}\" />"
    # add image if one exists
    unless social_image.nil?
      additional_meta += "\n<meta property=\"og:image\" content=\"#{social_image}\" />"
      additional_meta += "\n<meta property=\"og:image:width\" content=\"1200\" />"
      additional_meta += "\n<meta property=\"og:image:height\" content=\"630\" />"
    end
    # add twitter handle if one exists
    if artist_page.twitter_handle.present?
      additional_meta += "\n<meta property=\"twitter:creator\" content=\"@#{artist_page.twitter_handle}\" />"
    end
    response_html.gsub!(/<head>/, "<head>#{additional_meta}")

    render html: response_html.html_safe, content_type: "text/html"
  end

  def deeplink
    post = Post.find_by(id: request[:post_id])
    artist_page = post.artist_page
    return render_404 if artist_page.nil?

    response_html = render_to_string file: "public/index.html", layout: false

    social_image = CloudinaryImageHelper.facebook_share_image(artist_page)

    # replace title tag and title metas
    response_html.gsub!(/Ampled\s\|\s/, "#{post.title} | #{artist_page.name} | Ampled | ")

    # replace description metas
    response_html.gsub!(/content="Ampled allows[^"]+"/, "content=\"#{artist_page.bio}\"")

    # additional meta tags not already in index.html
    additional_meta = "\n<meta name=\"twitter:card\" content=\"summary_large_image\" /> \
    \n<meta name=\"og:description\" content=\"#{artist_page.bio}\" />"
    # add image if one exists
    unless social_image.nil?
      additional_meta += "\n<meta property=\"og:image\" content=\"#{social_image}\" />"
      additional_meta += "\n<meta property=\"og:image:width\" content=\"1200\" />"
      additional_meta += "\n<meta property=\"og:image:height\" content=\"630\" />"
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
