module SocialImages
  module Images
    class Story5 < SocialImage
      def build
        return nil if artist_page.accent_color.nil?

        image_url = BASE_UPLOAD_URL
        image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Story/Story5.png"

        {
          url: image_url,
          name: "#{clean_artist_name}_Story5.jpg",
          description: ""
        }
      end
    end
  end
end
