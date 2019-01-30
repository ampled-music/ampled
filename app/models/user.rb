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
#  locked_at              :datetime
#  name                   :string           not null
#  profile_image_url      :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  validates :name, presence: true

  has_many :page_ownerships, dependent: :destroy
  has_many :owned_pages, through: :page_ownerships, source: :artist_page

  has_many :subscriptions, dependent: :destroy
  has_many :supported_artists, through: :subscriptions, source: :artist_page

  has_many :posts, dependent: :destroy

  def subscribed?(artist_page)
    supported_artists.include?(artist_page)
  end
end
