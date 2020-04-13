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

    root to: "users#index"
  end

  get "/users/password/edit", to: "react#index"

  devise_for :users, controllers: {
    confirmations: "confirmations",
    registrations: "registrations",
    sessions: "sessions",
    passwords: "passwords"
  }

  resources :comments, only: %i[create destroy]
  resources :subscriptions
  resources :artist_pages

  resources :posts, only: %i[destroy update index]

  resources :artist_pages, only: [] do
    resources :posts, only: %i[create index]
  end

  put "me/updatecard", to: "subscriptions#update_platform_customer"
  devise_scope :user do
    put "me/changepassword", to: "registrations#update_password"
  end

  get "slug/:slug", to: "artist_pages#show"

  get "uploads/sign", to: "uploads#sign_file"
  get "uploads/playable_url", to: "uploads#playable_url"
  get "/me", to: "me#index"

  devise_scope :user do
    get "stripe_oauth_callback", to: "stripe#callback"
  end

  get "/stripe_success", to: "pages#stripe_success"
  post "/stripe_hook", to: "stripe#webhook"

  root to: "react#index"
  get "/artists/*path", to: "react#index"
  get "/artist/*path", to: "react#index"
  get "/support/*path", to: "react#index"
  get "/create_post/*path", to: "react#index"
  get "/connect", to: "react#index"
  get "/upload", to: "react#index"
  get "/settings", to: "react#index"
  get "/user-details", to: "react#index"

  get "/no_artist", to: "react#render_404"
  get "/*path", to: "react#render_404"
end
