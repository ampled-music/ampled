module SocialImages
  module Images
    class Square2 < SocialImage
      def build
        return nil if artist_page.accent_color.nil?

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

        {
          url: image_url,
          name: "#{clean_artist_name}_Grid2.jpg",
          description: ""
        }
      end
    end
  end
end
