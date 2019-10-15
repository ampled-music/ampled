namespace :dummy do
  desc "Generates fake data"

  task users: [:environment] do
    (1..10).map do |_|
      first = Faker::Name.first_name
      last = Faker::Name.last_name
      password = Faker::Internet.password
      social = Faker::Twitter.screen_name
      user = User.create(
        name: first,
        last_name: last,
        city: Faker::Address.city,
        country: Faker::Address.country_code,
        bio: Faker::TvShows::BojackHorseman.quote,
        twitter: social,
        instagram: social,
        email: Faker::Internet.email,
        profile_image_url: "https://robohash.org/#{ERB::Util.url_encode first}_#{ERB::Util.url_encode last}.jpg?set=set1&size=100x100",
        password: password,
        password_confirmation: password
      )
      user.confirm
      user
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
      "https://dummyimage.com/600x600/#{Faker::Color.hex_color[1..-1]}/fff"
    }

    artist_pages.each do |ap|
      ap.images << Image.create(url: image_url.call)
      ap.images << Image.create(url: image_url.call)
      ap.images << Image.create(url: image_url.call)
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
          title: Faker::Books::HitchhikersGuideToTheGalaxy.quote
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
