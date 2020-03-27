require "rails_helper"

describe UserSupportedArtistEmailJob, type: :job do
  it "sends an email to the user that subcribed to artist page" do
    allow(SendBatchEmail).to receive(:call)
    user = create(:user)
    artist_page = create(:artist_page)
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
            support_amount: format("%.2f", subscription.plan.nominal_amount / 100)
          }
        }
      ]
    )
  end
end
