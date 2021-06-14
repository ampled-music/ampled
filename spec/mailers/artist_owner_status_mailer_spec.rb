require "rails_helper"

RSpec.describe ArtistOwnerStatusMailer, type: :mailer do
  let(:owners) do
    [
      create(:user, name: "Garfield", email: "garfield@cbs.com"),
      create(:user, name: "Mr. Bigglesworth", email: "bigglesworth@evil.co")
    ]
  end
  let(:artist_page) { create(:artist_page, name: "Kitteh' Rock", slug: "kittehrock", owners: owners) }
  let(:artist_page_url) { "http://www.ampled.com/artist/kittehrock" }

  before(:each) do
    allow(artist_page).to receive(:url) { artist_page_url }
  end

  describe "#internal_artist_eligible_for_ownership" do
    let(:mail) { ArtistOwnerStatusMailer.internal_artist_eligible_for_ownership(artist_page) }

    it "sets template correctly" do
      expect(mail.message.template_model).to eq(
        artist_name: "Kitteh' Rock",
        artist_page_url: artist_page_url,
        page_owners: [
          {
            email: "garfield@cbs.com",
            name: "Garfield"
          },
          {
            email: "bigglesworth@evil.co",
            name: "Mr. Bigglesworth"
          }
        ]
      )
    end

    it "sets addresses correctly" do
      expect(mail.message.to).to eq(["hello@ampled.com", "austin@ampled.com"])
      expect(mail.message.from).to eq([ENV["POSTMARK_FROM_EMAIL"]].compact)
    end
  end

  describe "#artist_eligible_for_ownership" do
    let(:mail) { ArtistOwnerStatusMailer.artist_eligible_for_ownership(artist_page) }

    it "sets template correctly" do
      expect(mail.message.template_model).to eq({ _unused_key: "" })
    end

    it "sets addresses correctly" do
      expect(mail.message.to).to eq(["garfield@cbs.com", "bigglesworth@evil.co"])
      expect(mail.message.from).to eq([ENV["POSTMARK_FROM_EMAIL"]].compact)
    end
  end
end
