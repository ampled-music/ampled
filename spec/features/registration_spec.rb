require "rails_helper"

RSpec.describe "POST /users", type: :request do
  let(:url) { "/users" }
  let(:params) do
    {
      user: {
        email: "user@example.com",
        password: "password",
        password_confirmation: "password",
        name: Faker::Movies::StarWars.character
      }
    }
  end

  before(:each) do
    allow(Cloudinary::Uploader)
      .to receive(:destroy)
      .and_return({})
  end

  context "when user is unauthenticated" do
    before { post url, params: params }

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "returns a new user" do
      user = JSON.parse(response.body)
      expect(user["email"]).to eq "user@example.com"
    end
  end

  context "when user already exists" do
    before do
      create(:user, email: params[:user][:email])
      post url, params: params
    end

    it "returns bad request status" do
      expect(response.status).to eq 400
    end

    it "returns validation errors" do
      json = JSON.parse(response.body)
      expect(json["errors"].first["title"]).to eq("Bad Request")
    end
  end

  context "when updating a user" do
    let(:user) { create(:user, confirmed_at: Time.current, image: create(:image)) }

    let(:update_params) { { image: { url: "http://some.image.jpg", public_id: "new_public_id" } } }

    let(:url) { "/users" }

    before(:each) do
      sign_in user
    end

    it "returns 200" do
      put url, params: update_params

      expect(response.status).to eq 200
    end

    it "saves the updated parameters in the database" do
      put url, params: update_params

      user.reload
      expect(user.image.url).to eq "http://some.image.jpg"
      expect(user.image.public_id).to eq "new_public_id"
    end

    it "deletes the nested image, if requested" do
      expect {
        put url, params: { image: { id: user.image.id, _destroy: true } }
      }.to change(Image, :count).by(-1)

      user.reload
      expect(user.image).to eq(nil)
    end
  end
end
