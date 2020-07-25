class SocialImageService
  def self.banner_image(artist_page)
    new(artist_page).banner_image
  end

  def self.promote_square_images(artist_page)
    new(artist_page).promote_square_images
  end

  def self.promote_story_images(artist_page)
    new(artist_page).promote_story_images
  end

  def self.supporter_images(artist_page)
    new(artist_page).supporter_images
  end

  attr_accessor :artist_page

  def initialize(artist_page)
    @artist_page = artist_page
  end

  def banner_image
    SocialImages::Images::Banner.build(artist_page)
  end

  def promote_square_images
    square_images = []

    square_images << SocialImages::Images::Square1.build(artist_page)
    square_images << SocialImages::Images::Square2.build(artist_page)
    square_images << SocialImages::Images::Square3.build(artist_page)
    square_images << SocialImages::Images::Square4.build(artist_page)
    square_images << SocialImages::Images::Square5.build(artist_page)
    square_images << SocialImages::Images::Square6.build(artist_page)

    square_images
  end

  def promote_story_images
    story_images = []

    story_images << SocialImages::Images::StoryBlank.build(artist_page)
    story_images << SocialImages::Images::Story1.build(artist_page)
    story_images << SocialImages::Images::Story2.build(artist_page)
    story_images << SocialImages::Images::Story3.build(artist_page)
    story_images << SocialImages::Images::Story4.build(artist_page)
    story_images << SocialImages::Images::Story5.build(artist_page)
    story_images << SocialImages::Images::Story6.build(artist_page)

    story_images
  end

  def supporter_images
    supporter_images = []

    supporter_images << SocialImages::Images::SupporterSquare.build(artist_page)
    supporter_images << SocialImages::Images::SupporterStory.build(artist_page)

    supporter_images
  end
end
