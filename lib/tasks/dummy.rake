namespace :dummy do
  desc "Generates fake data"

  task admin: [:environment] do
    DummyData.admin
  end

  task users: [:environment] do
    DummyData.users
  end

  task artist_pages: [:environment] do
    DummyData.artist_pages
  end

  task posts: [:environment] do
    DummyData.posts
  end

  task destroy: [:environment] do
    DummyData.destroy
  end
end
