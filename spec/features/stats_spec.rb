require "rails_helper"
require "bullet"

RSpec.describe "GET /stats/summary.json", type: :request do
  let(:url) { "/stats/summary.json" }

  describe "is publicly accessible" do
    before(:each) do
      get url
    end

    it "returns 200" do
      expect(response.status).to eq 200
    end

    it "responds with data" do
      expect(JSON.parse(response.body)["counts"]).to be_a Object
    end
  end

  describe "counts" do
    it "only calls Subscription.active.count once" do
      active_relation = Subscription.active
      allow(Subscription).to receive(:active).and_return(active_relation)
      expect(active_relation).to receive(:count).once.and_call_original
      get url
    end

    context "with zero active subscriptions" do
      before(:each) do
        get url
      end

      it "returns zero for avg subscription amount" do
        counts = JSON.parse(response.body)["counts"]
        expect(counts["avg_subscription_amount"]).to eq("$0.00")
      end

      it "returns zero for total revenue" do
        counts = JSON.parse(response.body)["counts"]
        expect(counts["active_subscription_revenue"]).to eq("$0.00")
      end
    end

    context "with active subscriptions" do
      before do
        three_usd_plan = create(:plan, nominal_amount: 300, currency: "USD")
        five_usd_plan = create(:plan, nominal_amount: 500, currency: "USD")

        create(:subscription, plan: three_usd_plan, artist_page: three_usd_plan.artist_page, status: :pending_active)
        create(:subscription, plan: five_usd_plan, artist_page: five_usd_plan.artist_page, status: :active)
        create(:subscription, plan: three_usd_plan, artist_page: three_usd_plan.artist_page, status: :cancelled)
        create(:subscription, plan: three_usd_plan, artist_page: three_usd_plan.artist_page, status: :pending_cancelled)
      end

      before(:each) do
        get url
      end

      it "calculates and formats average subscription amount properly" do
        counts = JSON.parse(response.body)["counts"]
        expect(counts["avg_subscription_amount"]).to eq("$4.00")
      end

      it "calculates and formats average subscription amount properly" do
        counts = JSON.parse(response.body)["counts"]
        expect(counts["active_subscription_revenue"]).to eq("$8.00")
      end
    end
  end
end
