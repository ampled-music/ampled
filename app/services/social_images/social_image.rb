module SocialImages
  class SocialImage
    BASE_UPLOAD_URL = "https://res.cloudinary.com/#{Cloudinary.config.cloud_name}/image/upload"

    def self.build(artist_page)
      new(artist_page).build
    end

    attr_accessor :artist_page, :clean_artist_name

    def initialize(artist_page)
      @artist_page = artist_page
      @clean_artist_name = artist_page.name.gsub(/[^a-z0-9]/i, "_").downcase
    end

    protected

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
      broken_name = artistname.split
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
      case y_index
      when -180
        # Grid 2
        offset = (distance / 2).round
      when -400
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
end
