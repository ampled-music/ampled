require "rails_helper"

RSpec.describe SocialImageService, type: :service do
  let(:artist_page) { create(:artist_page, slug: "test") }

  describe "facebook_share_image" do
    let(:fb_img_uri) { "http://test.com/fb" }

    before(:each) do
      allow(SocialImages::Images::FacebookImage)
        .to receive(:build)
        .and_return(fb_img_uri)
    end

    it "should call build on FacebookImage with artist page" do
      # act
      SocialImageService.facebook_share_image(artist_page)

      # assert
      expect(SocialImages::Images::FacebookImage)
        .to have_received(:build)
        .with(artist_page)
    end

    it "should return what FacebookImage builds" do
      # act
      result = SocialImageService.facebook_share_image(artist_page)

      # assert
      expect(result)
        .to eq(fb_img_uri)
    end
  end

  describe "promote_square_images" do
    let(:square1) do
      {
        url: "http://test.com/square1",
        name: "Test_Grid1.jpg",
        description: "Test Description 1"
      }
    end
    let(:square2) do
      {
        url: "http://test.com/square2",
        name: "Test_Grid2.jpg",
        description: "Test Description 2"
      }
    end
    let(:square3) do
      {
        url: "http://test.com/square3",
        name: "Test_Grid3.jpg",
        description: "Test Description 3"
      }
    end
    let(:square4) do
      {
        url: "http://test.com/square4",
        name: "Test_Grid4.jpg",
        description: "Test Description 4"
      }
    end
    let(:square5) do
      {
        url: "http://test.com/square5",
        name: "Test_Grid5.jpg",
        description: "Test Description 5"
      }
    end
    let(:square6) do
      {
        url: "http://test.com/square6",
        name: "Test_Grid6.jpg",
        description: "Test Description 6"
      }
    end

    before(:each) do
      allow(SocialImages::Images::Square1)
        .to receive(:build)
        .and_return(square1)
      allow(SocialImages::Images::Square2)
        .to receive(:build)
        .and_return(square2)
      allow(SocialImages::Images::Square3)
        .to receive(:build)
        .and_return(square3)
      allow(SocialImages::Images::Square4)
        .to receive(:build)
        .and_return(square4)
      allow(SocialImages::Images::Square5)
        .to receive(:build)
        .and_return(square5)
      allow(SocialImages::Images::Square6)
        .to receive(:build)
        .and_return(square6)
    end

    it "should call build on each Square image with artist page" do
      # act
      SocialImageService.promote_square_images(artist_page)

      # assert
      expect(SocialImages::Images::Square1)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Square2)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Square3)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Square4)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Square5)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Square6)
        .to have_received(:build)
        .with(artist_page)
    end

    it "should return a list of all square images" do
      # act
      result = SocialImageService.promote_square_images(artist_page)

      # assert
      expect(result[0])
        .to eq(square1)
      expect(result[1])
        .to eq(square2)
      expect(result[2])
        .to eq(square3)
      expect(result[3])
        .to eq(square4)
      expect(result[4])
        .to eq(square5)
      expect(result[5])
        .to eq(square6)
    end
  end

  describe "promote_story_images" do
    let(:story_blank) do
      {
        url: "http://test.com/story-blank",
        name: "Test_StoryBlank.jpg",
        description: "Test Description Blank"
      }
    end
    let(:story1) do
      {
        url: "http://test.com/story1",
        name: "Test_Story1.jpg",
        description: "Test Description 1"
      }
    end
    let(:story2) do
      {
        url: "http://test.com/story2",
        name: "Test_Story2.jpg",
        description: "Test Description 2"
      }
    end
    let(:story3) do
      {
        url: "http://test.com/story3",
        name: "Test_Story3.jpg",
        description: "Test Description 3"
      }
    end
    let(:story4) do
      {
        url: "http://test.com/story4",
        name: "Test_Story4.jpg",
        description: "Test Description 4"
      }
    end
    let(:story5) do
      {
        url: "http://test.com/story5",
        name: "Test_Story5.jpg",
        description: "Test Description 5"
      }
    end
    let(:story6) do
      {
        url: "http://test.com/story6",
        name: "Test_Story6.jpg",
        description: "Test Description 6"
      }
    end

    before(:each) do
      allow(SocialImages::Images::StoryBlank)
        .to receive(:build)
        .and_return(story_blank)
      allow(SocialImages::Images::Story1)
        .to receive(:build)
        .and_return(story1)
      allow(SocialImages::Images::Story2)
        .to receive(:build)
        .and_return(story2)
      allow(SocialImages::Images::Story3)
        .to receive(:build)
        .and_return(story3)
      allow(SocialImages::Images::Story4)
        .to receive(:build)
        .and_return(story4)
      allow(SocialImages::Images::Story5)
        .to receive(:build)
        .and_return(story5)
      allow(SocialImages::Images::Story6)
        .to receive(:build)
        .and_return(story6)
    end

    it "should call build on each Story image with artist page" do
      # act
      SocialImageService.promote_story_images(artist_page)

      # assert
      expect(SocialImages::Images::StoryBlank)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Story1)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Story2)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Story3)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Story4)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Story5)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::Story6)
        .to have_received(:build)
        .with(artist_page)
    end

    it "should return a list of all story images" do
      # act
      result = SocialImageService.promote_story_images(artist_page)

      # assert
      expect(result[0])
        .to eq(story_blank)
      expect(result[1])
        .to eq(story1)
      expect(result[2])
        .to eq(story2)
      expect(result[3])
        .to eq(story3)
      expect(result[4])
        .to eq(story4)
      expect(result[5])
        .to eq(story5)
      expect(result[6])
        .to eq(story6)
    end
  end

  describe "supporter_images" do
    let(:supporter_square) do
      {
        url: "http://test.com/supporter-square",
        name: "Test_SupporterSquare.jpg",
        description: "Test Description Square"
      }
    end
    let(:supporter_story) do
      {
        url: "http://test.com/supporter-story",
        name: "Test_SupporterStory.jpg",
        description: "Test Description Story"
      }
    end

    before(:each) do
      allow(SocialImages::Images::SupporterSquare)
        .to receive(:build)
        .and_return(supporter_square)
      allow(SocialImages::Images::SupporterStory)
        .to receive(:build)
        .and_return(supporter_story)
    end

    it "should call build on each supporter image with artist page" do
      # act
      SocialImageService.supporter_images(artist_page)

      # assert
      expect(SocialImages::Images::SupporterSquare)
        .to have_received(:build)
        .with(artist_page)
      expect(SocialImages::Images::SupporterStory)
        .to have_received(:build)
        .with(artist_page)
    end

    it "should return a list of all story images" do
      # act
      result = SocialImageService.supporter_images(artist_page)

      # assert
      expect(result[0])
        .to eq(supporter_square)
      expect(result[1])
        .to eq(supporter_story)
    end
  end
end
