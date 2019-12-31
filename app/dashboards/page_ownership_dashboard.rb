require "administrate/base_dashboard"

class PageOwnershipDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    user: Field::BelongsTo.with_options(
      searchable: true,
      seachable_field: 'email',
    ),
    artist_page: Field::BelongsTo,
    id: Field::Number,
    role: Field::String,
    instrument: Field::String,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :user,
    :artist_page,
    :created_at,
    :role,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :user,
    :artist_page,
    :id,
    :created_at,
    :updated_at,
    :role,
    :instrument,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :user,
    :artist_page,
    :role,
    :instrument,
  ].freeze

  # Overwrite this method to customize how page ownerships are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(page_ownership)
  #   "PageOwnership ##{page_ownership.id}"
  # end
end
