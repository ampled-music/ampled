namespace :dummy do
  desc "Generates fake data"

  FAKE_ADMIN_EMAIL = "fake.admin@ampled.com"
  FAKE_ADMIN_PASSWORD = "greatpower"

  # return a newly create Image object that points at one of our "testing" images.
  #
  # Note: If someone, during testing, were to delete one of these testing images (e.g by
  # deleting the associated user), it will create broken Image objects in the database that point
  # at images that are no longer in Cloudinary. An alternative would be to re-upload these images
  # every time, which would create new instances of each image, and guarantee unsurprising behavior.
  def new_testing_image(imageable)
    random_image = rand(1..30)
    image_url = "https://res.cloudinary.com/ampledacceptance/image/upload/v1600287316/testing/TestingImage_#{random_image}.jpg"
    public_id = "v1600287316/testing/TestingImage_#{random_image}"

    Image.create!(imageable: imageable, url: image_url, public_id: public_id)
  end

  task admin: [:environment] do
    User.create!(
      name: "Admin Cat",
      last_name: "Bossypants",
      city: Faker::Address.city,
      country: Faker::Address.country_code,
      bio: Faker::TvShows::BojackHorseman.quote,
      email: FAKE_ADMIN_EMAIL,
      password: FAKE_ADMIN_PASSWORD,
      password_confirmation:  FAKE_ADMIN_PASSWORD,
      admin: true,
      confirmed_at: Time.now
    )
  end

  task users: [:environment] do
    (1..10).map do |_|
      first = Faker::Name.first_name
      last = Faker::Name.last_name
      password = Faker::Internet.password
      social = Faker::Twitter.screen_name
      user = User.create!(
        name: first,
        last_name: last,
        city: Faker::Address.city,
        country: Faker::Address.country_code,
        bio: Faker::TvShows::BojackHorseman.quote,
        twitter: social,
        instagram: social,
        email: Faker::Internet.email,
        password: password,
        password_confirmation: password,
        confirmed_at: Time.now
      )
      new_testing_image(user)
    end
  end

  task artist_pages: [:environment] do
    (1..5).map do |_|
      name = Faker::Music.band
      social = Faker::Twitter.screen_name
      artist_page = ArtistPage.create!(
        name: name,
        location: Faker::Address.city,
        twitter_handle: social,
        instagram_handle: social,
        video_url: "https://www.youtube.com/watch?v=4nsKDJlpUbA",
        bio: Faker::Books::Dune.quote,
        accent_color: Faker::Color.hex_color
      )
      artist_page.owners << User.all.sample([1, 2].sample)
      3.times { new_testing_image(artist_page) }
    end
  end

  task posts: [:environment] do
    ArtistPage.all.map do |ap|
      post_count = (0..4).to_a.sample
      (0..post_count).map do |_|
        author = ap.owners.sample
        Post.create!(
          user: author,
          artist_page: ap,
          body: Faker::Books::Lovecraft.paragraphs([1, 2].sample).join("\n"),
          title: Faker::Movies::HitchhikersGuideToTheGalaxy.quote
        )
      end
    end
  end

  task destroy: [:environment] do
    # Delete things in this order, to avoid foreign key violations.
    Post.delete_all
    ArtistPage.delete_all
    User.delete_all
  end
end
