module SocialImages
  module Images
    class Story4 < SocialImage
      def build
        return nil if artist_page.accent_color.nil?

        image_url = BASE_UPLOAD_URL
        image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Story/Story4.png"

        {
          url: image_url,
          name: "#{clean_artist_name}_Story4.jpg",
          description: ""
        }
      end
    end
  end
end
