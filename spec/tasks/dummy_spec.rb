require "./spec/support/rake_helpers"
require "rails_helper"

RSpec.describe "dummy.rake" do
  describe "dummy:admin" do
    xit "creates an admin user" do
      expect {
        RakeHelpers.run_task("dummy:admin")
      }.to change { User.where(admin: true).count }.by(1)
    end
  end

  describe "dummy:users" do
    it "creates 10 users" do
      expect {
        RakeHelpers.run_task("dummy:users")
      }.to change { User.count }.by(10)
    end
  end

  describe "dummy:artist_pages" do
    it "creates 5 artist_pages" do
      expect {
        RakeHelpers.run_task("dummy:artist_pages")
      }.to change { ArtistPage.count }.by(5)
    end
  end

  describe "dummy:posts" do
    before do
      # Create some artist pages with owners to create posts for
      RakeHelpers.run_task("dummy:users")
      RakeHelpers.run_task("dummy:artist_pages")
    end

    it "creates some posts" do
      post_count_before = Post.count
      RakeHelpers.run_task("dummy:posts")
      expect(Post.count).to be > post_count_before
    end
  end
end
