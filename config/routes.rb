Rails.application.routes.draw do
  resources :artist_pages
  namespace :admin do
    resources :users
    resources :artist_pages
    resources :posts
    resources :subscriptions
    resources :comments

    root to: "users#index"
  end

  resources :comments, only: [:create, :destroy]
  resources :subscriptions

  get 'uploads/sign', to: 'uploads#sign_file'
  get 'uploads/playable_url', to: 'uploads#playable_url'

  devise_for :users, controllers: { confirmations: 'confirmations' }

  root to: "pages#root"
end

