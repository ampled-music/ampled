require "rails_helper"

RSpec.describe "PUT /me/changepassword.json", type: :request do
  let!(:user) { create(:confirmed_user, email: "hi@hi.com", password: "password") }
  let(:url) { "/me/changepassword.json" }
  let(:params) do
    {
      user: {
        current_password: "password",
        password: "password2",
        password_confirmation: "password2"
      }
    }
  end

  let(:wrong_current_params) do
    {
      user: {
        current_password: "password1",
        password: "password2",
        password_confirmation: "password2"
      }
    }
  end

  let(:new_password_params) do
    {
      user: {
        password: "password2",
        email: "hi@hi.com"
      }
    }
  end

  context "when user is unauthenticated" do
    before { put url, params: params }

    it "returns 400" do
      expect(response.status).to eq 400
    end
  end

  context "when user is authenticated" do
    before(:each) do
      sign_in user
    end

    context "and current password is wrong" do
      before { put url, params: wrong_current_params }

      it "returns 400" do
        expect(response.status).to eq 400
      end
    end

    context "and current password is right" do
      before { put url, params: params }

      it "returns 200" do
        expect(response.status).to eq 200
      end

      it "successfully changes the password" do
        post "/users/sign_in.json", params: new_password_params
        expect(response.status).to eq 201
      end
    end
  end
end
