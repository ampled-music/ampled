Rails.application.routes.draw do
  namespace :admin do
    resources :users
    resources :artist_pages
    resources :images
    resources :posts
    resources :subscriptions
    resources :comments
    resources :plans

    root to: "users#index"
  end

  devise_for :users, controllers: {
    confirmations: "confirmations",
    registrations: "registrations",
    sessions: "sessions"
  }

  resources :comments, only: %i[create destroy]
  resources :subscriptions
  resources :artist_pages

  resources :posts, only: %i[destroy]

  resources :artist_pages, only: [] do
    resources :posts, only: %i[create index]
  end

  get "slug/:slug", to: "artist_pages#show"

  get "uploads/sign", to: "uploads#sign_file"
  get "uploads/playable_url", to: "uploads#playable_url"
  get "/me", to: "me#index"

  devise_scope :user do
    get "stripe_oauth_callback", to: "stripe#callback"
  end

  get "/stripe_success", to: "pages#stripe_success"
  root to: "react#index"
  get "/*path", to: "react#index"
end
