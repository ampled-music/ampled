namespace :dummy do
  desc "Generates fake data"

  task users: [:environment] do
    User.all.map(&:destroy)

    users = (1..10).map do |_|
      first = Faker::Name.first_name
      last = Faker::Name.last_name
      password = Faker::Internet.password
      social = Faker::Twitter.screen_name
      User.create(
        name: first,
        last_name: last,
        city: Faker::Address.city,
        country: Faker::Address.country_code,
        bio: Faker::TvShows::BojackHorseman.quote,
        twitter: social,
        instagram: social,
        email: Faker::Internet.email,
        profile_image_url: "https://res.cloudinary.com/ampled-web/image/upload/v1586552080/testing/TestingImage_#{rand(1..30)}.jpg",
        password: password,
        password_confirmation: password
      )
    end

    image_url = -> {
      "https://res.cloudinary.com/ampled-web/image/upload/testing/users/TestingUserImage_#{rand(1..10)}.jpg"
    }
    public_id = -> {
      "testing/users/TestingUserImage_#{rand(1..30)}"
    }

    users.each do |us|
      us.image << Image.create(url: image_url.call, public_id: public_id.call)
    end
  end

  task artist_pages: [:environment] do
    ArtistPage.all.map(&:destroy)

    artist_pages = (1..5).map do |_|
      name = Faker::Music.band
      social = Faker::Twitter.screen_name
      ArtistPage.create(
        name: name,
        location: Faker::Address.city,
        twitter_handle: social,
        instagram_handle: social,
        video_url: "https://www.youtube.com/watch?v=4nsKDJlpUbA",
        bio: Faker::Books::Dune.quote,
        accent_color: Faker::Color.hex_color
      )
    end

    artist_pages.each do |ap|
      ap.owners << User.all.sample([1, 2].sample)
    end

    image_url = -> {
      "https://res.cloudinary.com/ampled-web/image/upload/v1586552080/testing/TestingImage_#{rand(1..30)}.jpg"
    }
    public_id = -> {
      "v1586552080/testing/TestingImage_#{rand(1..30)}"
    }

    artist_pages.each do |ap|
      ap.images << Image.create(url: image_url.call, public_id: public_id.call)
      ap.images << Image.create(url: image_url.call, public_id: public_id.call)
      ap.images << Image.create(url: image_url.call, public_id: public_id.call)
    end
  end

  task posts: [:environment] do
    Post.delete_all
    ArtistPage.all.map do |ap|
      post_count = (0..4).to_a.sample
      (0..post_count).map do |_|
        author = ap.owners.sample
        Post.create(
          user: author,
          artist_page: ap,
          body: Faker::Books::Lovecraft.paragraphs([1, 2].sample).join("\n"),
          title: Faker::Movies::HitchhikersGuideToTheGalaxy.quote
        )
      end
    end
  end

  task destroy: [:environment] do
    User.delete_all
    ArtistPage.delete_all
    Post.delete_all
  end
end
