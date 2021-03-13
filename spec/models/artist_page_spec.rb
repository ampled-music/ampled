require "rails_helper"
require "shared_context/cloudinary_stub"

RSpec.describe ArtistPage, type: :model do
  include_context "cloudinary_stub"

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

  describe ".unapproved scope" do
    let!(:approved_page) { create(:artist_page, approved: true) }
    let!(:unapproved_page) { create(:artist_page, approved: false) }

    it "returns unapproved artist pages" do
      expect(ArtistPage.unapproved).to include(unapproved_page)
    end

    it "does not return approved artist pages" do
      expect(ArtistPage.unapproved).to_not include(approved_page)
    end
  end

  describe ".with_images scope" do
    let!(:page_with_images) { create(:artist_page, approved: true, images: [create(:image)]) }
    let!(:sad_imageless_page) { create(:artist_page, approved: true) }

    it "returns page with images" do
      expect(ArtistPage.with_images).to include(page_with_images)
    end

    it "does not return artist pages with no images" do
      expect(ArtistPage.with_images).to_not include(sad_imageless_page)
    end
  end

  describe "#application_fee_percent" do
    let(:artist_page) { create(:artist_page) }

    it "defaults to 13.24" do
      expect(artist_page.application_fee_percent).to eq 13.24
    end
  end

  describe "#valid?" do
    context "with application_fee_percent less than 0" do
      it "is false" do
        artist_page = build(:artist_page, application_fee_percent: -0.01)

        expect(artist_page.valid?).to be false
      end
    end

    context "with application_fee_percent less than 0" do
      it "is true" do
        artist_page = build(:artist_page, application_fee_percent: 0)

        expect(artist_page.valid?).to be true
      end
    end

    context "with application_fee_percent over 100" do
      it "is false" do
        artist_page = build(:artist_page, application_fee_percent: 100.01)

        expect(artist_page.valid?).to be false
      end
    end

    context "with application_fee_percent of 100" do
      it "is true" do
        artist_page = build(:artist_page, application_fee_percent: 100)

        expect(artist_page.valid?).to be true
      end
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
      page_with_images.images.each do |image|
        expect(image.url).to_not be_nil
        expect(image.public_id).to_not be_nil
      end
    end
  end

  describe "#stripe_product" do
    let(:artist_page) { build(:artist_page, name: name, stripe_product_id: nil) }

    # Examples that test the transformation of an artist's name into a statement descriptor
    [
      {
        description: "strips disallowed statement descriptor characters",
        name: "*(ryan\'s) ironic \"band\"*",
        expected_statement_descriptor: "ryans ironic band"
      },
      {
        description: "pads a statement descriptor that is too short",
        name: "ê",
        expected_statement_descriptor: "ê    "
      },
      {
        description: "shortens a statement_descriptor this is too long",
        name: "abcdefghijkmnopqrstuvwxyz",
        expected_statement_descriptor: "abcdefghijkmnopqrstuvw"
      }
    ].each do |example_case|
      let(:name) { example_case[:name] }
      let(:expected_statement_descriptor) { example_case[:expected_statement_descriptor] }

      it "#{example_case[:description]} when creating a product" do
        product_double = double("Stripe Product",
                                id: "some not nil id", statement_descriptor: expected_statement_descriptor)

        allow(Stripe::Product).to receive(:retrieve).and_return(product_double)
        expect(Stripe::Product).to receive(:create).with(
          hash_including(statement_descriptor: expected_statement_descriptor),
          stripe_account: artist_page.stripe_user_id
        ).and_return(product_double)

        artist_page.stripe_product
      end

      it "#{example_case[:description]} when updating a product" do
        product_double = double("Stripe Product", statement_descriptor: nil)
        artist_page.stripe_product_id = "some not nil id"

        allow(Stripe::Product).to receive(:retrieve).and_return(product_double)
        expect(Stripe::Product).to receive(:update).with(
          artist_page.stripe_product_id,
          hash_including(statement_descriptor: expected_statement_descriptor),
          stripe_account: artist_page.stripe_user_id
        )

        artist_page.stripe_product
      end
    end
  end

  describe "#plan_for_nominal_amount" do
    context "when a product exists but no plan exists" do
      let(:artist_page) { create(:artist_page, stripe_product_id: "prod_qdffzsd7843") }
      let(:product_double) do
        double(
          "Stripe Product",
          id: "prod_qdffzsd7843",
          statement_descriptor: "Some Band"
        )
      end

      before do
        allow(Stripe::Product).to receive(:retrieve).and_return(product_double)
      end

      it "creates a Stripe plan" do
        expect(Stripe::Plan).to receive(:create).with(
          {
            product: "prod_qdffzsd7843",
            nickname: "Ampled Support",
            interval: "month",
            currency: "usd",
            amount: 649
          }, stripe_account: artist_page.stripe_user_id
        ).and_return(double("Stripe Plan", id: "plan_afdsa453"))

        artist_page.plan_for_nominal_amount(Money.new(600, "usd"))
      end

      it "creates a local plan" do
        allow(Stripe::Plan).to receive(:create).and_return(double("Stripe Plan", id: "plan_hkjdfg8991"))

        expect { artist_page.plan_for_nominal_amount(Money.new(600, "usd")) }.to change {
          Plan.where(
            stripe_id: "plan_hkjdfg8991",
            nominal_amount: 600,
            charge_amount: 649,
            currency: "usd"
          ).count
        }.by(1)
      end
    end

    context "when a plan exists" do
      let(:expected_plan) { create(:plan) }
      let(:artist_page) { expected_plan.artist_page }

      it "returns the plan" do
        plan = artist_page.plan_for_nominal_amount(expected_plan.nominal_amount)
        expect(plan).to eq(expected_plan)
      end
    end
  end

  describe "#url" do
    let(:artist_page) { create(:artist_page, slug: "kittehrock") }
    it "returns the page's url" do
      old_env_variable = ENV["REACT_APP_API_URL"]
      ENV["REACT_APP_API_URL"] = "http://www.ampled.com"
      expect(artist_page.url).to eq("http://www.ampled.com/artist/kittehrock")
      ENV["REACT_APP_API_URL"] = old_env_variable
    end
  end
end
