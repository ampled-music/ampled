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

    context("given event_type is payout.paid") do
      let(:amount) { 2402 }
      let(:currency) { "usd" }
      let(:arrival_date) { 1_586_136_170 }
      let(:account) { "acc_12345" }

      before(:each) do
        webhook_params[:type] = "payout.paid"
        webhook_params[:account] = account
        webhook_params[:data][:object][:amount] = amount
        webhook_params[:data][:object][:currency] = currency
        webhook_params[:data][:object][:arrival_date] = arrival_date
      end

      it "should have called ArtistPaidEmailJob" do
        allow(ArtistPaidEmailJob).to receive(:perform_async)

        prev_redis_url = ENV["REDIS_URL"]
        begin
          ENV["REDIS_URL"] = "temp"
          post webhook_url, params: webhook_params
        ensure
          ENV["REDIS_URL"] = prev_redis_url
        end

        expect(ArtistPaidEmailJob).to have_received(:perform_async)
          .with(account, amount, currency, DateTime.strptime(arrival_date.to_s, "%s"))
      end

      it "should rescue and capture ArtistNotFound error" do
        error = ArtistPaidEmailJob::ArtistNotFound.new "BOOM! Test error message."
        allow(ArtistPaidEmailJob).to receive(:perform_async).and_raise(error)
        allow(Raven).to receive(:capture_exception)

        prev_redis_url = ENV["REDIS_URL"]
        begin
          ENV["REDIS_URL"] = "temp"
          post webhook_url, params: webhook_params
        ensure
          ENV["REDIS_URL"] = prev_redis_url
        end

        json = JSON.parse(response.body)
        expect(json["message"]).to eq(error.message)
        expect(Raven).to have_received(:capture_exception).with(error)
      end

      it "should rescue and capture ConnectAccountNotFound error" do
        error = ArtistPaidEmailJob::ConnectAccountNotFound.new "BOOM! Test error message."
        allow(ArtistPaidEmailJob).to receive(:perform_async).and_raise(error)
        allow(Raven).to receive(:capture_exception)

        prev_redis_url = ENV["REDIS_URL"]
        begin
          ENV["REDIS_URL"] = "temp"
          post webhook_url, params: webhook_params
        ensure
          ENV["REDIS_URL"] = prev_redis_url
        end

        json = JSON.parse(response.body)
        expect(json["message"]).to eq(error.message)
        expect(Raven).to have_received(:capture_exception).with(error)
      end
    end
  end
end
