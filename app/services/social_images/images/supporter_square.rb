module SocialImages
  module Images
    class SupporterSquare < SocialImage
      def build
        artist_image = artist_page.images.first
        return nil if artist_image.nil?

        image_url = BASE_UPLOAD_URL
        image_url += "/c_fill,h_1500,w_1500,g_faces/l_social:Supporter:Grid/"
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

        {
          url: image_url,
          name: "#{clean_artist_name}_Grid.jpg",
          description: ""
        }
      end
    end
  end
end
