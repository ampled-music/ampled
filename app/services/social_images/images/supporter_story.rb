module SocialImages
  module Images
    class SupporterStory < SocialImage
      def build
        artist_image = artist_page.images.first
        return nil if artist_image.nil?

        image_url = BASE_UPLOAD_URL
        image_url += "/c_fill,h_1200,w_675,g_face/l_social:Supporter:Story_1.1/"
        image_url += cloudinary_artist_name_string(
          {
            position: "north_west",
            x: 105,
            y: 125,
            distance: 50,
            font_size: 40,
            color: "ffffff",
            bgcolor: "202020"
          }
        )
        image_url += "/l_text:Arial_30_bold:%20ampled.com%252Fartist%252F#{artist_page.slug}%20,"
        image_url += "co_rgb:ffffff,b_rgb:202020,g_south,y_107/"
        image_url += handle_public_id(artist_image.url)

        {
          url: image_url,
          name: "#{clean_artist_name}_Story.jpg",
          description: ""
        }
      end
    end
  end
end
