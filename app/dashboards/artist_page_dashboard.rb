require "administrate/base_dashboard"

class ArtistPageDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    owners: Field::HasMany.with_options(class_name: "User", show: %i[email], searchable: true,
      searchable_field: 'email'),
    id: Field::Number,
    name: Field::String,
    location: Field::String,
    bio: Field::String,
    accent_color: Field::String,
    banner_image_url: Field::String,
    twitter_handle: Field::String,
    instagram_handle: Field::String,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
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
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :name,
    :id,
    :owners,
    :location,
    :bio,
    :accent_color,
    :banner_image_url,
    :twitter_handle,
    :instagram_handle,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :owners,
    :name,
    :location,
    :bio,
    :accent_color,
    :banner_image_url,
    :twitter_handle,
    :instagram_handle,
  ].freeze

  # Overwrite this method to customize how artist pages are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(artist_page)
  #   "ArtistPage ##{artist_page.id}"
  # end
end
