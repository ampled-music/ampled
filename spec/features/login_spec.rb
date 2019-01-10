require 'rails_helper'

RSpec.describe 'POST /users/sign_in.json', type: :request do
  let!(:user) { create(:confirmed_user, email: "hi@hi.com") }
  let(:url) { '/users/sign_in.json' }
  let(:good_params) do
    {
      user: {
        email: user.email,
        password: "password"
      }
    }
  end

  let(:bad_params) do
    {
      user: {
        email: user.email,
        password: "otherpassword"
      }
    }
  end

  context 'when params are correct' do

    before do
      post '/users/sign_in.json',  { params: good_params }
    end

    it 'returns 201' do
      expect(response).to have_http_status(201)
    end

    it 'returns JWT token in authorization header' do
      expect(response.headers['Authorization']).to be_present
    end

  end

  context 'when login params are incorrect' do
    before { post url, params: bad_params }

    it 'returns unathorized status' do
      expect(response.status).to eq 401
    end
  end
end

RSpec.describe 'DELETE /logout', type: :request do
  let(:url) { '/users/sign_out.json' }

  it 'returns 204, no content' do
    delete url
    expect(response).to have_http_status(204)
  end
end
