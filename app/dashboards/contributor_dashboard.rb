require "administrate/base_dashboard"

class ContributorDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    user: Field::BelongsTo.with_options(
      order: 'email',
      searchable: true,
      searchable_field: 'email',
    ),
    id: Field::Number,
    joined_on: Field::DateTime,
    worker_owner_on: Field::DateTime,
    inactive_on: Field::DateTime,
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
    :id,
    :joined_on,
    :worker_owner_on,
    :inactive_on
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :user,
    :id,
    :joined_on,
    :worker_owner_on,
    :inactive_on,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :user,
    :joined_on,
    :worker_owner_on,
    :inactive_on,
  ].freeze

  # Overwrite this method to customize how contributors are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(contributor)
    contributor.user.email
  end
end
