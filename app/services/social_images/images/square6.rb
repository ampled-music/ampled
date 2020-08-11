module SocialImages
  module Images
    class Square6 < SocialImage
      def build
        return nil if artist_page.accent_color.nil?

        image_url = BASE_UPLOAD_URL
        image_url += "/l_text:Arial_50_bold:%20ampled.com%252Fartist%252F#{artist_page.slug}%20,"
        image_url += "co_rgb:ffffff,b_rgb:202020,g_south,y_300/"
        image_url += "/b_rgb:#{adjust_background_color(artist_page.accent_color)}/social/Grid/Grid6.1.png"

        {
          url: image_url,
          name: "#{clean_artist_name}_Grid6.jpg",
          description: ""
        }
      end
    end
  end
end
