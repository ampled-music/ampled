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
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: user.email,
          template_alias: "user-supported-artist",
          template_model: {
            artist_name: artist_page.name,
            artist_page_link: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist_page.slug}",
            promote_artist_page_link: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist_page.slug}/promote",
            social_image_url: social_image[:url],
            support_amount: format("%.2f", subscription.plan.nominal_amount / 100.0)
          }
        },
        {
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: user.email,
          template_alias: "new-community-member",
          template_model: {
            artist_name: artist_page.name,
            artist_page_link: "#{ENV["REACT_APP_API_URL"]}/artist/community",
            promote_artist_page_link: "#{ENV["REACT_APP_API_URL"]}/artist/community/promote",
            social_image_url: social_image[:url],
            support_amount: format("%.2f", subscription.plan.nominal_amount / 100.0)
          }
        }
      ]
    )
  end
end
