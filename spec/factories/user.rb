# == Schema Information
#
# Table name: users
#
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  created_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  id                     :bigint(8)        not null, primary key
#  jti                    :string           not null
#  locked_at              :datetime
#  name                   :string           not null
#  profile_image_url      :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  stripe_customer_id     :string
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_jti                   (jti) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#

FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { "password" }
    name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    factory :confirmed_user do
      confirmed_at { Time.zone.now }
    end
    jti { SecureRandom.uuid }
  end
end
