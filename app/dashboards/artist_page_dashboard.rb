require "administrate/base_dashboard"

class ArtistPageDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  def display_resource(artist_page)
    "#{artist_page.name} - #{artist_page.id}"
  end
  ATTRIBUTE_TYPES = {
    owners: Field::HasMany.with_options(class_name: "User", show: %i[email], searchable: false,
                                        searchable_field: 'email'),
    images: Field::HasMany.with_options(show: %i[url]),
    id: Field::Number,
    name: Field::String,
    slug: Field::String,
    location: Field::String,
    bio: Field::Text,
    accent_color: Field::String,
    twitter_handle: Field::String,
    instagram_handle: Field::String,
    bandcamp_handle: Field::String,
    youtube_handle: Field::String,
    external: Field::String,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    stripe_signup_url: Field::Text,
    stripe_dashboard_url: Field::Text,
    video_url: Field::String,
    approved: Field::Boolean,
    featured: Field::Boolean,
    verb_plural: Field::Boolean,
    hide_members: Field::Boolean,
    style_type: Field::Select.with_options(
      collection: ['standard', 'minimal']
    ),
    subscriber_count: Field::Number,
    subscribers: Field::HasMany.with_options(class_name: "User")
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :name,
    :id,
    :owners,
    :approved,
    :subscriber_count,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :name,
    :id,
    :slug,
    :subscriber_count,
    :owners,
    :location,
    :bio,
    :accent_color,
    :twitter_handle,
    :instagram_handle,
    :bandcamp_handle,
    :youtube_handle,
    :external,
    :created_at,
    :updated_at,
    :stripe_signup_url,
    :stripe_dashboard_url,
    :video_url,
    :approved,
    :featured,
    :verb_plural,
    :hide_members,
    :style_type,
    :subscribers
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :owners,
    :name,
    :slug,
    :location,
    :bio,
    :accent_color,
    :twitter_handle,
    :instagram_handle,
    :bandcamp_handle,
    :youtube_handle,
    :external,
    :video_url,
    :approved,
    :featured,
    :verb_plural,
    :hide_members,
    :style_type
  ].freeze

  # Overwrite this method to customize how artist pages are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(artist_page)
  #   "ArtistPage ##{artist_page.id}"
  # end
end
