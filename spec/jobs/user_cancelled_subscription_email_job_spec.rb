require "rails_helper"

describe UserCancelledSubscriptionEmailJob, type: :job do
  it "sends an email to the user that cancelled subscription" do
    allow(SendBatchEmail).to receive(:call)
    user = create(:user)
    artist_page = create(:artist_page, slug: "slug")
    plan = create(:plan, artist_page: artist_page, nominal_amount: 500)
    subscription = create(:subscription, user: user, artist_page: artist_page, plan: plan, status: :cancelled)

    described_class.new.perform(subscription.id)

    expect(SendBatchEmail).to have_received(:call).with(
      [
        {
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: user.email,
          template_alias: "user-cancelled-subscription",
          template_model: {
            artist_name: artist_page.name,
            user_name: user.name,
            artist_support_link: "#{ENV["REACT_APP_API_URL"]}/support/#{artist_page.slug}"
          }
        }
      ]
    )
  end

  it "does not send an email unless subscription is cancelled" do
    allow(SendBatchEmail).to receive(:call)
    user = create(:user)
    artist_page = create(:artist_page)
    plan = create(:plan, artist_page: artist_page, nominal_amount: 500)
    subscription = create(:subscription, user: user, artist_page: artist_page, plan: plan, status: :active)

    described_class.new.perform(subscription.id)

    expect(SendBatchEmail).to_not have_received(:call)
  end
end
