class CloudinaryImageHelper
  BASE_UPLOAD_URL = "https://res.cloudinary.com/ampled-web/image/upload"

  def self.facebook_share_image(artist_page)
    new(artist_page).facebook_share_image
  end

  def self.promote_square_images(artist_page)
    new(artist_page).promote_square_images
  end

  def self.promote_story_images(artist_page)
    new(artist_page).promote_story_images
  end

  def self.supporter_images(artist_page)
    new(artist_page).supporter_images
  end

  attr_accessor :artist_page
  attr_accessor :clean_artist_name

  def initialize(artist_page)
    @artist_page = artist_page
    @clean_artist_name = artist_page.name.gsub(/[^a-z0-9]/i, "_").downcase
  end

  def facebook_share_image
    artist_image = artist_page.images.first
    return nil if artist_image.nil?

    options = {
      position: "north_west",
      x: 50,
      y: 50,
      distance: 55,
      font_size: 45,
      color: "ffffff",
      bgcolor: "202020"
    }

    image = BASE_UPLOAD_URL
    image += "/c_fill,h_630,w_1200/c_scale,g_south_east,l_social:AmpledLogo,w_200,x_50,y_50/"
    image += cloudinary_artist_name_string(options) + "/"
    image += handle_public_id(artist_image.url)

    image
  end

  def promote_square_images
    artist_image = artist_page.images.first
    return nil if artist_image.nil?

    square_images = []

    # Square 1
    image_url = BASE_UPLOAD_URL
    image_url += "/c_fill,h_1500,w_1500/l_social:Grid:Grid1/"
    image_url += cloudinary_artist_name_string(
      {
        position: "north_west",
        x: 220,
        y: 160,
        distance: 80,
        font_size: 65,
        color: "ffffff",
        bgcolor: "202020"
      }
    )
    image_url += "/"
    image_url += handle_public_id(artist_image.url)
    square_images << {
      url: image_url,
      name: "#{clean_artist_name}_Grid1.jpg",
      description: ""
    }

    # Square 2
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/"
    image_url += cloudinary_artist_name_string(
      {
        position: "center",
        x: 0,
        y: -180,
        distance: 100,
        font_size: 75,
        color: "ffffff",
        bgcolor: "202020"
      }
    )
    image_url += "social/Grid/Grid2.png"
    square_images << {
      url: image_url,
      name: "#{clean_artist_name}_Grid2.jpg",
      description: ""
    }

    # Square 3
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Grid/Grid3.png"
    square_images << {
      url: image_url,
      name: "#{clean_artist_name}_Grid3.jpg",
      description: ""
    }

    # Square 4
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Grid/Grid4.png"
    square_images << {
      url: image_url,
      name: "#{clean_artist_name}_Grid4.jpg",
      description: ""
    }

    # Square 5
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Grid/Grid5.png"
    square_images << {
      url: image_url,
      name: "#{clean_artist_name}_Grid5.jpg",
      description: ""
    }

    # Square 6
    image_url = BASE_UPLOAD_URL
    image_url += "/l_text:Arial_55_bold:%20ampled.com%252Fartist%252F#{artist_page.slug}%20,"
    image_url += "co_rgb:ffffff,b_rgb:202020,g_south,y_380/"
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Grid/Grid6.png"
    square_images << {
      url: image_url,
      name: "#{clean_artist_name}_Grid6.jpg",
      description: ""
    }

    square_images
  end

  def promote_story_images
    artist_image = artist_page.images.first
    return nil if artist_image.nil?

    story_images = []

    # Story 'Blank'
    image_url = BASE_UPLOAD_URL
    image_url += "/c_fill,h_2666,w_1500/l_social:Story:StoryBlank/"
    image_url += cloudinary_artist_name_string(
      {
        position: "north_west",
        x: 220,
        y: 160,
        distance: 100,
        font_size: 85,
        color: "ffffff",
        bgcolor: "202020"
      }
    )
    image_url += "/"
    image_url += handle_public_id(artist_image.url)
    story_images << {
      url: image_url,
      name: "#{clean_artist_name}_StoryBlank.jpg",
      description: ""
    }

    # Story 1
    image_url = BASE_UPLOAD_URL
    image_url += "/c_fill,h_2666,w_1500/l_social:Story:Story1/"
    image_url += cloudinary_artist_name_string(
      {
        position: "north_west",
        x: 220,
        y: 210,
        distance: 100,
        font_size: 85,
        color: "ffffff",
        bgcolor: "202020"
      }
    )
    image_url += "/"
    image_url += handle_public_id(artist_image.url)
    story_images << {
      url: image_url,
      name: "#{clean_artist_name}_Story1.jpg",
      description: ""
    }

    # Story 2
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/"
    image_url += cloudinary_artist_name_string(
      {
        position: "center",
        x: 0,
        y: -400,
        distance: 120,
        font_size: 85,
        color: "ffffff",
        bgcolor: "202020"
      }
    )
    image_url += "social/Story/Story2.png"
    story_images << {
      url: image_url,
      name: "#{clean_artist_name}_Story2.jpg",
      description: ""
    }

    # Story 3
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Story/Story3.png"
    story_images << {
      url: image_url,
      name: "#{clean_artist_name}_Story3.jpg",
      description: ""
    }

    # Story 4
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Story/Story4.png"
    story_images << {
      url: image_url,
      name: "#{clean_artist_name}_Story4.jpg",
      description: ""
    }

    # Story 5
    image_url = BASE_UPLOAD_URL
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Story/Story5.png"
    story_images << {
      url: image_url,
      name: "#{clean_artist_name}_Story5.jpg",
      description: ""
    }

    # Story 6
    image_url = BASE_UPLOAD_URL
    image_url += "/l_text:Arial_60_bold:%20ampled.com%252Fartist%252F#{artist_page.slug}%20,"
    image_url += "co_rgb:ffffff,b_rgb:202020,g_center,y_100/"
    image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Story/Story6.png"
    story_images << {
      url: image_url,
      name: "#{clean_artist_name}_Story6.jpg",
      description: ""
    }

    story_images
  end

  def supporter_images
    artist_image = artist_page.images.first
    return nil if artist_image.nil?

    supporter_images = []

    # Square
    image_url = BASE_UPLOAD_URL
    image_url += "/c_fill,h_1500,w_1500/l_social:Supporter:Grid/"
    image_url += cloudinary_artist_name_string(
      {
        position: "north_west",
        x: 220,
        y: 160,
        distance: 80,
        font_size: 65,
        color: "ffffff",
        bgcolor: "202020"
      }
    )
    image_url += "/l_text:Arial_60_bold:%20ampled.com%252Fartist%252F#{artist_page.slug}%20,"
    image_url += "co_rgb:ffffff,b_rgb:202020,g_south_east,y_280,x_100/"
    image_url += handle_public_id(artist_image.url)
    supporter_images << {
      url: image_url,
      name: "#{clean_artist_name}_Grid.jpg",
      description: ""
    }

    # Story
    image_url = BASE_UPLOAD_URL
    image_url += "/c_fill,h_2666,w_1500/l_social:Supporter:Story/"
    image_url += cloudinary_artist_name_string(
      {
        position: "north_west",
        x: 220,
        y: 270,
        distance: 100,
        font_size: 85,
        color: "ffffff",
        bgcolor: "202020"
      }
    )
    image_url += "/l_text:Arial_65_bold:%20ampled.com%252Fartist%252F#{artist_page.slug}%20,"
    image_url += "co_rgb:ffffff,b_rgb:202020,g_south,y_500/"
    image_url += handle_public_id(artist_image.url)
    supporter_images << {
      url: image_url,
      name: "#{clean_artist_name}_Story.jpg",
      description: ""
    }

    supporter_images
  end

  private

  # == Generate new rgb after applying opacity
  #
  # eg. adjust_background_color("aabbcc", 0.2) => "f8f2ee"
  #
  def adjust_background_color(accent_color, opacity = 0.2)
    accent_color = accent_color[1, 6] if accent_color[0, 1] == "#"

    r = adjust_channel(accent_color[0, 2], opacity)
    g = adjust_channel(accent_color[2, 2], opacity)
    b = adjust_channel(accent_color[4, 2], opacity)

    "#{r}#{g}#{b}"
  end

  def adjust_channel(hex, opacity)
    ((hex.to_i(16) * opacity) + ((1 - opacity) * 255)).round.to_s(16)
  end

  def handle_public_id(image)
    url = image.split "/"
    part1 = url[-2]
    part2 = url[-1]
    "#{part1}/#{part2}"
  end

  def cloudinary_artist_name_string(options)
    # options: { position, x, y, distance, font_size, color, bgcolor }
    position, distance, xpos, y_index = options.values_at(:position, :distance, :x, :y)
    font_size, color, bgcolor = options.values_at(:font_size, :color, :bgcolor)

    broken_name = build_broken_name artist_page.name
    return "" unless broken_name.length < 5 && broken_name.length.positive?

    # Adjust font size for long names
    broken_name_adjustment = 1 + (0.2 * [broken_name.length - 3, 0].max)
    font_size = (font_size / broken_name_adjustment).round
    distance = (distance / broken_name_adjustment).round

    # Adjust positioning for certain cases
    y_index = adjust_name_positioning y_index, distance, broken_name if position == "center" && xpos.zero?

    name_part = ""

    # Cycle through and build text plate
    broken_name.each do |namepiece|
      name_part += "l_text:Arial_#{font_size}_bold:%20#{ERB::Util.url_encode(namepiece)}%20,"
      name_part += "co_rgb:#{color},b_rgb:#{bgcolor},g_#{position},x_#{xpos},y_#{y_index}/"
      y_index += distance
    end

    name_part
  end

  def build_broken_name(artistname)
    broken_name = artistname.split " "
    name_string = ""
    name_array = []

    broken_name.each_with_index do |namepart, index|
      if namepart.length < 7
        # Build string of small words
        name_string = "#{name_string}#{namepart} "

        if index == broken_name.length - 1 || (name_string.length > 10 && namepart.length >= 3)
          # If it's the last word push what's left in the string,
          # or push built string of small words once it's over 10.
          # This push also resets the built string in name_string.
          # Otherwise, continue loop.
          name_string = push_and_strip name_array, name_string
        end
      else
        # Words longer than 6 get their own line

        # If there is a string being built, push that before the next word
        name_string = push_and_strip name_array, name_string unless name_string.empty?

        # Push the next word
        name_array.push namepart
      end
    end

    name_array
  end

  def adjust_name_positioning(y_index, distance, broken_name)
    offset = 0
    if y_index == -180
      # Grid 2
      offset = (distance / 2).round
    elsif y_index == -400
      # Story 2
      offset = 60
    end

    broken_name.each_with_index do |_, index|
      y_index -= offset unless index.zero?
    end

    y_index
  end

  def push_and_strip(name_array, name_string)
    # push modifies name_array in place despite being a param
    name_array.push name_string.strip

    # reset name_string
    ""
  end
end
