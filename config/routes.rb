Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :habit_tasks, only: [:index, :show, :create, :update, :destroy]
      resources :daily_tasks, only: [:index, :show, :create, :update, :destroy]
      resources :todo_tasks, only: [:index, :show, :create, :update, :destroy]
      post "gemini", to: "gemini#create"
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
