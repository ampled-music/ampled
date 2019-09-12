namespace :dummy do
  desc "Generates fake data"

  task users: [:environment] do
    (1..10).map do |_|
      password = Faker::Internet.password
      name = Faker::StarWars.character
      user = User.create(
        name: name,
        email: Faker::Internet.email,
        profile_image_url: "https://robohash.org/#{ERB::Util.url_encode name}.jpg?set=set1&size=100x100",
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
      ArtistPage.create(
        name: name,
        location: Faker::GameOfThrones.city,
        twitter_handle: Faker::Twitter.screen_name,
        instagram_handle: Faker::Twitter.screen_name,
        video_url: "https://www.youtube.com/watch?v=4nsKDJlpUbA",
        bio: Faker::Dune.quote,
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
          body: Faker::Lovecraft.paragraphs([1, 2].sample).join("\n"),
          title: Faker::HitchhikersGuideToTheGalaxy.quote
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
