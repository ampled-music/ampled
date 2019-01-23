namespace :dummy do
  desc "Generates fake data"
  task data: [:environment] do
    users = (1..10).map do |_|
      password = Faker::Internet.password
      user = User.create(
        name: Faker::StarWars.character,
        email: Faker::Internet.email,
        password: password,
        password_confirmation: password
      )
      user.confirm
      user
    end

    artist_pages = (1..5).map do |_|
      name = Faker::Music.band
      ArtistPage.create(
        name: name,
        location: Faker::GameOfThrones.city,
        twitter_handle: Faker::Twitter.screen_name,
        instagram_handle: Faker::Twitter.screen_name,
        banner_image_url: "https://robohash.org/#{ERB::Util.url_encode name}.png?set=set1&size=550x550",
        bio: Faker::Dune.quote,
        accent_color: Faker::Color.hex_color
      )
    end

    artist_pages.each do |ap|
      ap.owners << users.sample([1, 2].sample)
    end

    artist_pages.map { |ap|
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
    }.flatten
  end
end
