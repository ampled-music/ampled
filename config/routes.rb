Rails.application.routes.draw do
  resources :artist_pages
  namespace :admin do
    resources :users
    resources :artist_pages
    # resources :page_ownerships

    root to: "users#index"
  end

  devise_for :users, controllers: { confirmations: 'confirmations' }

  root to: "pages#root"
end
