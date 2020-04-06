require "rails_helper"

RSpec.describe StripeController, type: :request do
  let(:artist_page) { create(:artist_page, slug: "test", approved: true) }

  context "when webhook is called" do
    let(:webhook_url) { "/stripe_hook" }
    let(:artist_page) { create(:artist_page) }
    let(:webhook_params) do
      {
        object: "event",
        data: {
          object: {
            id: "abc"
          }
        }
      }
    end

    before(:each) do
      allow(Stripe::Webhook).to receive(:construct_event) { nil }
      allow(ArtistPage).to receive(:find_by) { artist_page }
    end

    it "returns 200" do
      post webhook_url, params: webhook_params

      expect(response.status).to eq 200
    end

    it "should find artist page by stripe user id" do
      stripe_user_id = "test_stripe_user_id"
      webhook_params[:account] = stripe_user_id
      allow(ArtistPage).to receive(:find_by)

      post webhook_url, params: webhook_params

      expect(ArtistPage).to have_received(:find_by).with({ stripe_user_id: stripe_user_id })
    end

    context("given event_type is payout.paid") do
      let(:amount) { 2402 }
      let(:arrival_date) { 1_586_136_170 }

      before(:each) do
        webhook_params[:type] = "payout.paid"
        webhook_params[:data][:object][:amount] = amount
        webhook_params[:data][:object][:arrival_date] = arrival_date
      end

      it "should have called ArtistPagePaidEmailJob" do
        allow(ArtistPagePaidEmailJob).to receive(:perform_async)

        prev_redis_url = ENV["REDIS_URL"]
        begin
          ENV["REDIS_URL"] = "temp"
          post webhook_url, params: webhook_params
        ensure
          ENV["REDIS_URL"] = prev_redis_url
        end

        expect(ArtistPagePaidEmailJob).to have_received(:perform_async)
          .with(artist_page, amount, DateTime.strptime(arrival_date.to_s, "%s"))
      end
    end
  end
end
