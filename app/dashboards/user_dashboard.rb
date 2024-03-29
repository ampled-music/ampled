require "administrate/base_dashboard"

class UserDashboard < Administrate::BaseDashboard
  def display_resource(user)
    user.email
  end
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    email: Field::String,
    reset_password_token: Field::String,
    reset_password_sent_at: Field::DateTime,
    remember_created_at: Field::DateTime,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    confirmed_at: Field::DateTime,
    locked_at: Field::DateTime,
    name: Field::String,
    last_name: Field::String,
    image: Field::HasOne,
    city: Field::String,
    country: Field::String,
    twitter: Field::String,
    instagram: Field::String,
    bio: Field::String,
    ship_address: Field::String,
    ship_address2: Field::String,
    ship_city: Field::String,
    ship_state: Field::String,
    ship_country: Field::String,
    ship_zip: Field::String,
    admin: Field::Boolean,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :id,
    :email,
    :name,
    :last_name,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :email,
    :reset_password_sent_at,
    :reset_password_token,
    :remember_created_at,
    :locked_at,
    :created_at,
    :updated_at,
    :confirmed_at,
    :name,
    :last_name,
    :city,
    :country,
    :twitter,
    :instagram,
    :bio,
    :ship_address,
    :ship_address2,
    :ship_city,
    :ship_state,
    :ship_zip,
    :ship_country,
    :admin,
    :image
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :email,
    :name,
    :last_name,
    :city,
    :country,
    :twitter,
    :instagram,
    :bio,
    :ship_address,
    :ship_address2,
    :ship_city,
    :ship_state,
    :ship_zip,
    :ship_country,
    :confirmed_at,
    :admin,
  ].freeze

  # Overwrite this method to customize how users are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(user)
  #   "User ##{user.id}"
  # end
end
