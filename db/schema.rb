# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_01_30_031834) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "artist_pages", force: :cascade do |t|
    t.string "name"
    t.string "location"
    t.string "bio"
    t.string "accent_color"
    t.string "banner_image_url"
    t.string "twitter_handle"
    t.string "instagram_handle"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "video_url"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "post_id"
    t.bigint "user_id"
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "images", force: :cascade do |t|
    t.string "url"
    t.integer "order"
    t.bigint "artist_page_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["artist_page_id"], name: "index_images_on_artist_page_id"
  end

  create_table "page_ownerships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "artist_page_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["artist_page_id", "user_id"], name: "index_page_ownerships_on_artist_page_id_and_user_id"
    t.index ["user_id", "artist_page_id"], name: "index_page_ownerships_on_user_id_and_artist_page_id"
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "artist_page_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.text "body"
    t.string "image_url"
    t.string "audio_file"
    t.index ["artist_page_id"], name: "index_posts_on_artist_page_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.bigint "artist_page_id"
    t.bigint "user_id"
    t.index ["artist_page_id"], name: "index_subscriptions_on_artist_page_id"
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", null: false
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.datetime "locked_at"
    t.string "profile_image_url"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "posts", "artist_pages"
  add_foreign_key "posts", "users"
  add_foreign_key "subscriptions", "artist_pages"
  add_foreign_key "subscriptions", "users"
end
