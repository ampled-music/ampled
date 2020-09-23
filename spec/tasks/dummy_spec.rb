require "rails_helper"

RSpec.describe "dummy.rake" do
  before :all do
    Rails.application.load_tasks
  end

  def run_task(name)
    Rake::Task[name].invoke
    # Because 'invoke' only executes a task once, subsequent calls to invoke for
    # the same task do nothing. This is undesirable for testing, so we manually
    # re-enable a task after invoking it.
    Rake::Task[name].reenable
  end

  describe "dummy:admin" do
    it "creates an admin user" do
      expect {
        run_task("dummy:admin")
      }.to change { User.where(admin: true).count }.by(1)
    end
  end

  describe "dummy:users" do
    it "creates 10 users" do
      expect {
        run_task("dummy:users")
      }.to change { User.count }.by(10)
    end
  end

  describe "dummy:artist_pages" do
    it "creates 5 artist_pages" do
      expect {
        run_task("dummy:artist_pages")
      }.to change { ArtistPage.count }.by(5)
    end
  end

  describe "dummy:posts" do
    before do
      # Create some artist pages with owners to create posts for
      run_task("dummy:users")
      run_task("dummy:artist_pages")
    end

    it "creates some posts" do
      post_count_before = Post.count
      run_task("dummy:posts")
      expect(Post.count).to be > post_count_before
    end
  end
end
