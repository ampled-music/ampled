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

ActiveRecord::Schema.define(version: 2020_11_29_095835) do

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
    t.string "video_screenshot_url"
    t.string "state_token"
    t.string "stripe_user_id"
    t.string "stripe_product_id"
    t.string "slug"
    t.boolean "verb_plural", default: false
    t.boolean "approved", default: false
    t.boolean "featured", default: false
    t.boolean "hide_members", default: false
    t.string "bandcamp_handle"
    t.string "youtube_handle"
    t.string "external"
    t.string "style_type"
    t.boolean "artist_owner", default: false, null: false
    t.index ["slug"], name: "index_artist_pages_on_slug", unique: true
  end

  create_table "audio_uploads", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.string "public_id", null: false
    t.string "hash_key"
    t.string "name"
    t.integer "duration"
    t.integer "waveform", default: [], null: false, array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_audio_uploads_on_post_id"
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

  create_table "contributor_time", force: :cascade do |t|
    t.bigint "contributor_id"
    t.date "started_on"
    t.date "ended_on"
    t.float "hours"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contributor_id"], name: "index_contributor_time_on_contributor_id"
  end

  create_table "contributors", force: :cascade do |t|
    t.bigint "user_id"
    t.date "joined_on"
    t.date "worker_owner_on"
    t.date "inactive_on"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_contributors_on_user_id"
  end

  create_table "images", force: :cascade do |t|
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "public_id"
    t.string "imageable_type"
    t.bigint "imageable_id"
    t.string "coordinates"
    t.string "delete_token"
    t.index ["imageable_type", "imageable_id"], name: "index_images_on_imageable_type_and_imageable_id"
  end

  create_table "page_ownerships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "artist_page_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", default: "member"
    t.string "instrument"
    t.index ["artist_page_id", "user_id"], name: "index_page_ownerships_on_artist_page_id_and_user_id"
    t.index ["user_id", "artist_page_id"], name: "index_page_ownerships_on_user_id_and_artist_page_id"
  end

  create_table "plans", force: :cascade do |t|
    t.integer "nominal_amount", null: false
    t.string "stripe_id", null: false
    t.bigint "artist_page_id", null: false
    t.string "currency", default: "usd", null: false
    t.integer "charge_amount", null: false
    t.index ["artist_page_id"], name: "index_plans_on_artist_page_id"
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "artist_page_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.text "body"
    t.boolean "is_private", default: false
    t.boolean "allow_download", default: false
    t.string "video_embed_url"
    t.string "post_type"
    t.index ["artist_page_id"], name: "index_posts_on_artist_page_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.bigint "artist_page_id"
    t.bigint "user_id"
    t.string "stripe_customer_id"
    t.bigint "plan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0
    t.string "stripe_id"
    t.index ["artist_page_id"], name: "index_subscriptions_on_artist_page_id"
    t.index ["plan_id"], name: "index_subscriptions_on_plan_id"
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
    t.string "jti", null: false
    t.string "stripe_customer_id"
    t.string "last_name"
    t.string "city"
    t.string "country"
    t.string "twitter"
    t.string "instagram"
    t.string "bio"
    t.string "ship_address"
    t.string "ship_address2"
    t.string "ship_city"
    t.string "ship_state"
    t.string "ship_zip"
    t.string "ship_country"
    t.string "card_last4"
    t.string "card_brand"
    t.string "card_exp_month"
    t.string "card_exp_year"
    t.boolean "card_is_valid"
    t.boolean "admin"
    t.string "redirect_uri"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "audio_uploads", "posts"
  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "contributor_time", "contributors"
  add_foreign_key "contributors", "users"
  add_foreign_key "plans", "artist_pages"
  add_foreign_key "posts", "artist_pages"
  add_foreign_key "posts", "users"
  add_foreign_key "subscriptions", "artist_pages"
  add_foreign_key "subscriptions", "plans"
  add_foreign_key "subscriptions", "users"
end
