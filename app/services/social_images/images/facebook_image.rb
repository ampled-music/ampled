module SocialImages
  module Images
    class FacebookImage < SocialImage
      def build
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
    end
  end
end
