Rails.application.routes.draw do
  namespace :admin do
    resources :users
    resources :artist_pages
    resources :images
    resources :posts
    resources :subscriptions
    resources :comments
    resources :plans
    resources :page_ownerships
    resources :contributors
    resources :contributor_time

    root to: "users#index"
  end

  # Routes to serve the needs of end-to-end Cypress tests
  if Rails.env.test? || Rails.env.development?
    namespace :test do
      get "reset_database", to: "databases#reset"
    end
  end

  get "/users/password/edit", to: "react#index"

  devise_for :users, controllers: {
    confirmations: "confirmations",
    registrations: "registrations",
    sessions: "sessions",
    passwords: "passwords"
  }

  resources :comments, only: %i[create destroy]
  resources :subscriptions, only: %i[create destroy update]
  resources :artist_pages

  resources :posts, only: %i[destroy update index]

  resources :artist_pages, only: [] do
    resources :posts, only: %i[create index]
  end

  devise_scope :user do
    put "me/changepassword", to: "registrations#update_password"
  end

  get "slug/:slug", to: "artist_pages#show"
  post "artist/:slug/request_approval", to: "artist_pages#request_approval"
  get "artist/:slug/post/:postid/download", to: "posts#download_post"
  get "artist/:slug/subscribers_csv", to: "artist_pages#subscribers_csv"
  get "slug/:slug/post/:id", to: "posts#show"
  get "artists/browse", to: "artist_pages#browse"
  get "artists/typeahead", to: "artist_pages#typeahead"
  get "artists/all_artists", to: "artist_pages#all_artists"
  get "stats/summary", to: "stats#summary"
  get "notifications", to: "notifications#index"
  post "notifications/:id/read", to: "notifications#mark_as_read"
  post "notifications/:id/delete", to: "notifications#destroy"
  post "notifications/read_all", to: "notifications#mark_all_as_read"

  get "uploads/sign", to: "uploads#sign_file"
  get "uploads/playable_url", to: "uploads#playable_url"
  post "uploads/cloudinary", to: "uploads#cloudinary_upload"

  resources :me, only: [:index] do
    put :update_card, on: :collection
  end

  devise_scope :user do
    get "stripe_oauth_callback", to: "stripe#callback"
  end

  get "/stripe_success", to: "pages#stripe_success"
  post "/stripe_hook", to: "stripe#webhook"

  root to: "react#index"
  get "/artists/*path", to: "react#index"
  get "/artist/:artist_name/post/:post_id", to: "react#deeplink"
  get "/artist/*artist_name", to: "react#artist_page"
  get "/support/*artist_name", to: "react#artist_page"
  get "/create_post/*path", to: "react#index"
  get "/connect", to: "react#index"
  get "/upload", to: "react#index"
  get "/settings", to: "react#index"
  get "/user-details", to: "react#index"
  get "/browse", to: "react#index"
  get "/feed", to: "react#index"
  get "/stats", to: "react#index"

  get "/no_artist", to: "react#render404"
  get "/*path", to: "react#render404"
end
