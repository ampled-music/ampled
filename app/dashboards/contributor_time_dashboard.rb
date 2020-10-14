require "administrate/base_dashboard"

class ContributorTimeDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    contributor: Field::BelongsTo,
    id: Field::Number,
    started_on: Field::DateTime,
    ended_on: Field::DateTime,
    hours: Field::Number.with_options(decimals: 2),
    notes: Field::Text,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :contributor,
    :id,
    :started_on,
    :ended_on,
    :hours,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :contributor,
    :id,
    :started_on,
    :ended_on,
    :hours,
    :notes,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :contributor,
    :started_on,
    :ended_on,
    :hours,
    :notes,
  ].freeze

  # Overwrite this method to customize how contributor time are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(contributor_time)
  #   "ContributorTime ##{contributor_time.id}"
  # end
end
