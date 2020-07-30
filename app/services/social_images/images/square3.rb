module SocialImages
  module Images
    class Square3 < SocialImage
      def build
        return nil if artist_page.accent_color.nil?

        image_url = BASE_UPLOAD_URL
        image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Grid/Grid3.png"

        {
          url: image_url,
          name: "#{clean_artist_name}_Grid3.jpg",
          description: ""
        }
      end
    end
  end
end
