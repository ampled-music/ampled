# == Schema Information
#
# Table name: users
#
#  ad_address             :string
#  ad_address2            :string
#  ad_city                :string
#  ad_country             :string
#  ad_state               :string
#  ad_zip                 :string
#  bio                    :string
#  city                   :string
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  country                :string
#  created_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  id                     :bigint(8)        not null, primary key
#  instagram              :string
#  jti                    :string           not null
#  last_name              :string
#  locked_at              :datetime
#  name                   :string           not null
#  profile_image_url      :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  stripe_customer_id     :string
#  twitter                :string
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_jti                   (jti) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  validates :name, presence: true

  has_many :page_ownerships, dependent: :destroy
  has_many :owned_pages, through: :page_ownerships, source: :artist_page

  has_many :subscriptions, dependent: :destroy
  has_many :subscribed_artists, through: :subscriptions, source: :artist_page

  has_many :posts, dependent: :destroy

  def supported_artists
    subscribed_artists.merge(Subscription.active)
  end

  def subscribed?(artist_page)
    supported_artists.include?(artist_page)
  end
end
