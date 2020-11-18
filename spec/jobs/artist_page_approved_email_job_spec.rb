require "rails_helper"

describe ArtistPageApprovedEmailJob, type: :job do
  let(:social_image) do
    {
      name: "socialImg1",
      url: "social-image.com",
      description: ""
    }
  end

  it "sends emails to the owners of the artist page" do
    allow(SendBatchEmail).to receive(:call)
    allow(SocialImages::Images::Square1).to receive(:build) { social_image }

    owner = create(:user)
    artist = create(:artist_page, name: "Testpage", slug: "test")
    artist.owners << owner

    described_class.new.perform(artist.id)

    expect(SendBatchEmail).to have_received(:call).with(
      [
        {
          from: Rails.application.config.postmark_from_email,
          to: owner.email,
          template_alias: "artist-page-approved",
          template_model: {
            app_base_url: Rails.application.config.react_app_api_url,
            artist_name: artist.name,
            artist_slug: artist.slug,
            social_image_url: social_image[:url]
          }
        }
      ]
    )
  end
end
