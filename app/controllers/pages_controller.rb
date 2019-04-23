class PagesController < ApplicationController
  layout "empty"

  helper_method :stripe_signup_url

  def stripe_signup_url(artist_page)
    base = "https://connect.stripe.com/express/oauth/authorize"
    params = {
      redirect_uri: 'http://localhost:3000/stripe_oauth_callback',
      client_id: 'ca_Eowu0ycKNxFo46f8hqlCNCpt4w26bxer',
      state: artist_page.stripe_state_token,
      "suggested_capabilities[]" => "card_payments"
    }.to_query
    "#{base}?#{params}"
  end

  def root
  end

  def stripe
    @current_user = User.where(email: "benton.anderson@gmail.com").first
  end
end
