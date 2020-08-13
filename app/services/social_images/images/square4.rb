module SocialImages
  module Images
    class Square4 < SocialImage
      def build
        return nil if artist_page.accent_color.nil?

        image_url = BASE_UPLOAD_URL
        image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Grid/Grid4.1.png"

        {
          url: image_url,
          name: "#{clean_artist_name}_Grid4.jpg",
          description: ""
        }
      end
    end
  end
end
