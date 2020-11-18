require "rails_helper"

describe UserSupportedArtistEmailJob, type: :job do
  let(:social_image) do
    {
      name: "socialImg1",
      url: "social-image.com",
      description: ""
    }
  end

  it "sends an email to the user that subcribed to artist page" do
    allow(SendBatchEmail).to receive(:call)
    allow(SocialImages::Images::SupporterSquare).to receive(:build) { social_image }

    user = create(:user)
    artist_page = create(:artist_page, slug: "slug")
    plan = create(:plan, artist_page: artist_page, nominal_amount: 500)
    subscription = create(:subscription, user: user, artist_page: artist_page, plan: plan)

    described_class.new.perform(subscription.id)

    expect(SendBatchEmail).to have_received(:call).with(
      [
        {
          from: Rails.application.config.postmark_from_email,
          to: user.email,
          template_alias: "user-supported-artist",
          template_model: {
            artist_name: artist_page.name,
            artist_page_link: artist_page.url,
            promote_artist_page_link: "#{artist_page.url}/promote",
            social_image_url: social_image[:url],
            support_amount: "5.00"
          }
        }
      ]
    )
  end

  it "sends an email to the user that subcribed to community page" do
    allow(SendBatchEmail).to receive(:call)
    allow(SocialImages::Images::SupporterSquare).to receive(:build) { social_image }

    user = create(:user)
    artist_page = create(:artist_page, slug: "community")
    plan = create(:plan, artist_page: artist_page, nominal_amount: 500)
    subscription = create(:subscription, user: user, artist_page: artist_page, plan: plan)

    described_class.new.perform(subscription.id)

    expect(SendBatchEmail).to have_received(:call).with(
      [
        {
          from: Rails.application.config.postmark_from_email,
          to: user.email,
          template_alias: "new-community-member",
          template_model: {
            artist_name: artist_page.name,
            artist_page_link: artist_page.url,
            promote_artist_page_link: "#{artist_page.url}/promote",
            social_image_url: social_image[:url],
            support_amount: "5.00"
          }
        }
      ]
    )
  end
end
