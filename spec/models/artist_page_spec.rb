require "rails_helper"

RSpec.describe ArtistPage, type: :model do
  describe ".approved scope" do
    let!(:approved_page) { create(:artist_page, approved: true) }
    let!(:unapproved_page) { create(:artist_page, approved: false) }

    it "returns approved artist pages" do
      expect(ArtistPage.approved).to include(approved_page)
    end

    it "does not return not approved artist pages" do
      expect(ArtistPage.approved).to_not include(unapproved_page)
    end
  end

  describe "#monthly_total" do
    context "with active subscriptions" do
      it "returns the montly total" do
        ap = create(:artist_page)
        plan_a = create(:plan, artist_page: ap)
        plan_b = create(:plan, artist_page: ap)
        subscriber_a = create(:user)
        subscriber_b = create(:user)
        create(:subscription, plan: plan_a, user: subscriber_a, artist_page: ap)
        create(:subscription, plan: plan_b, user: subscriber_b, artist_page: ap)

        expect(ap.monthly_total).to eq(plan_a.nominal_amount + plan_b.nominal_amount)
      end
    end

    context "without any subscriptions" do
      it "returns 0" do
        ap = create(:artist_page)

        expect(ap.monthly_total).to eq(0)
      end
    end
  end

  describe "#last_payout" do
    context "with a previous payout" do
      let(:existing_stripe_auth) { JSON.parse(File.read("stripe_account_stub.json")) }

      it "returns the payout date", vcr: true do
        ap = create(:artist_page, stripe_user_id: existing_stripe_auth["stripe_user_id"])

        Stripe::Charge.create(
          amount: 50_000,
          currency: "usd",
          source: "tok_bypassPending",
          transfer_data: {
            destination: ap.stripe_user_id
          }
        )

        Stripe::Payout.create(
          {
            amount: 1,
            currency: "usd",
            source_type: "card"
          },
          stripe_account: ap.stripe_user_id
        )

        expect(ap.last_payout).to eq(Time.new(2020, 1, 21, 0, 53, 5, "+00:00"))
      end
    end

    context "with no previous payout" do
      it "returns nil" do
        ap = create(:artist_page)

        expect(ap.last_payout).to eq(nil)
      end
    end
  end

  describe "#images" do
    let(:image) { create(:image) }
    let!(:artist_page) { create(:artist_page, images: [image]) }

    it "get deleted when owning Artist Page is deleted" do
      expect {
        artist_page.destroy!
      }.to change { Image.all.count }.by(-1)
    end

    it "can be set as nested attributes" do
      page_with_images = described_class.new(
        name: "Kitten Rock",
        images_attributes: [
          { url: "http://first.jpg", public_id: "first_public_id" },
          { url: "http://second.jpg", public_id: "second_public_id" }
        ]
      )
      expect { page_with_images.save! }.to change { Image.all.count }.by(2)
      page_with_images.reload
      expect(page_with_images.images[0]).to have_attributes(url: "http://first.jpg", public_id: "first_public_id")
      expect(page_with_images.images[1]).to have_attributes(url: "http://second.jpg", public_id: "second_public_id")
    end
  end
end
