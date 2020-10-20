require "rails_helper"

RSpec.describe Plan, type: :model do
  subject { described_class.new }

  let(:plan) { create(:plan, nominal_amount: 1000, charge_amount: 1100, currency: "usd") }

  describe "#nominal_amount" do
    it "is a Money object" do
      expect(plan.nominal_amount).to eq Money.new(1000, "usd")
    end
  end

  describe "#charge_amount" do
    it "is a Money object" do
      expect(plan.charge_amount).to eq Money.new(1100, "usd")
    end
  end
end
