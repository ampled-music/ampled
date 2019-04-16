Rails.application.routes.draw do
  resources :artist_pages
  namespace :admin do
    resources :users
    resources :artist_pages
    resources :images
    resources :posts
    resources :subscriptions
    resources :comments

    root to: "users#index"
  end

  resources :comments, only: %i[create destroy]
  resources :subscriptions
  resources :artist_pages, only: [] do
    resources :posts, only: %i[create index]
  end

  get "uploads/sign", to: "uploads#sign_file"
  get "uploads/playable_url", to: "uploads#playable_url"

  get "/me", to: "me#index"

  devise_for :users, controllers: { confirmations: "confirmations", registrations: "registrations" }

  root to: "pages#root"

  get 'stripe' to: "pages#stripe"
end
