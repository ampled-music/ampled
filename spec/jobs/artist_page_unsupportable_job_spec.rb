require "rails_helper"

describe ArtistPageUnsupportableEmailJob, type: :job do
  it "sends emails to the owners of the artist page" do
    allow(SendBatchEmail).to receive(:call)
    owner = create(:user)
    artist = create(:artist_page, name: "Testpage")
    artist.owners << owner

    described_class.new.perform(artist.id, 5000)

    expect(SendBatchEmail).to have_received(:call).with(
      [
        {
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: owner.email,
          template_alias: "artist-page-unsupportable",
          template_model: {
            artist_name: artist.name,
            nice_amount: "$50.00",
            stripe_link: artist.stripe_dashboard_url
          }
        }
      ]
    )
  end
end
