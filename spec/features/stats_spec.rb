require "rails_helper"
require "bullet"

RSpec.describe "GET /stats/summary.json", type: :request do
  let!(:subscriptions) { create_list(:subscription, 2) }
  let(:artist_page) { create(:artist_page, slug: "test", approved: true) }
  let(:artist_page_unapproved) { create(:artist_page, slug: "unapproved", approved: false) }

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
        allow(Subscription).to receive_message_chain(:includes, :active).and_return([])
        allow(Subscription).to receive_message_chain(:active, :count).and_return(0)
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
  end
end
