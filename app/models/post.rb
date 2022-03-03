# == Schema Information
#
# Table name: posts
#
#  allow_download  :boolean          default(FALSE)
#  artist_page_id  :bigint(8)
#  body            :text
#  created_at      :datetime         not null
#  embed_url       :string
#  id              :bigint(8)        not null, primary key
#  is_private      :boolean          default(FALSE)
#  post_type       :string
#  title           :string
#  updated_at      :datetime         not null
#  user_id         :bigint(8)
#  video_embed_url :string
#
# Indexes
#
#  index_posts_on_artist_page_id  (artist_page_id)
#  index_posts_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (artist_page_id => artist_pages.id)
#  fk_rails_...  (user_id => users.id)
#

class Post < ApplicationRecord
  belongs_to :artist_page
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :audio_uploads, dependent: :destroy
  has_many :images, as: :imageable, dependent: :destroy

  accepts_nested_attributes_for :audio_uploads, allow_destroy: true
  accepts_nested_attributes_for :images, allow_destroy: true

  validate :embed_url_safe

  def author
    user.name
  end

  def author_image
    user.image
  end

  def has_audio
    return true if audio_uploads.any?

    false
  end

  def has_video_embed
    return true if video_embed_url.present?

    false
  end

  def has_embed
    return true if embed_url.present?

    false
  end

  def url
    "#{artist_page.url}/post/#{id}"
  end

  private

  ALLOWED_IFRAME_ATTRIBUTES = %w[
    src
    style
  ]

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def embed_url_safe
    return unless embed_url_changed?

    parsed_html = Nokogiri.Slop("<doc>#{embed_url}</doc>").children.first

    return if
      parsed_html.children.count == 1 &&
      (iframe = parsed_html.children.first).name == "iframe" &&
      iframe.attributes.keys.all? { |attribute| ALLOWED_IFRAME_ATTRIBUTES.include?(attribute) } &&
      iframe.attributes["src"]&.value&.match?(%r{^https://bandcamp.com/.*}) &&
      iframe.attributes.values.map(&:value).none? { |value| value.include?("javascript") } &&
      iframe.children.count == 1 &&
      (anchor = iframe.children.first).name == "a" &&
      anchor.attributes.keys == ["href"] &&
      anchor.attributes["href"].value.match?(%r{^https://[^.]*\.bandcamp.com/.*}) &&
      anchor.children.count == 1 &&
      anchor.children.first.text?

    errors.add(:embed_url, :not_valid, message: "does not match expected format")
  end
  # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
end
