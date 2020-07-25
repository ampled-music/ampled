module SocialImages
  module Images
    class Banner < SocialImage
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

        image_url = BASE_UPLOAD_URL
        image_url += "/c_fill,h_630,w_1200/c_scale,g_south_east,l_social:AmpledLogo,w_200,x_50,y_50/"
        image_url += cloudinary_artist_name_string(options) + "/"
        image_url += handle_public_id(artist_image.url)

        {
          url: image_url,
          name: "#{clean_artist_name}_banner.jpg",
          description: ""
        }
      end
    end
  end
end
