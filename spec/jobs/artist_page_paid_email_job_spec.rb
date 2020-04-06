require "rails_helper"

describe ArtistPagePaidEmailJob, type: :job do
  it "returns early when artist_page param is blank" do
    allow(PageOwnership).to receive(:where)
    described_class.new.perform(nil, 1244, DateTime.now)
    expect(PageOwnership).to_not have_received(:where)
  end

  it "returns early when amount is negative" do
    allow(PageOwnership).to receive(:where)
    described_class.new.perform(create(:artist_page), -412, DateTime.now)
    expect(PageOwnership).to_not have_received(:where)
  end

  it "returns early when amount is zero" do
    allow(PageOwnership).to receive(:where)
    described_class.new.perform(create(:artist_page), 0, DateTime.now)
    expect(PageOwnership).to_not have_received(:where)
  end

  it "returns early when arrival_date is nil" do
    allow(PageOwnership).to receive(:where)
    described_class.new.perform(create(:artist_page), 1234, nil)
    expect(PageOwnership).to_not have_received(:where)
  end

  it "returns early when no admin owners are found for artist_page" do
    allow(SendBatchEmail).to receive(:call)

    member_user = create(:user)
    artist_page = create(:artist_page, owners: [member_user])
    amount_in_cents = 1641
    arrival_date = DateTime.now

    described_class.new.perform(artist_page, amount_in_cents, arrival_date)

    expect(SendBatchEmail).to_not have_received(:call)
  end

  it "sends an email to the admins of the artist page" do
    allow(SendBatchEmail).to receive(:call)

    admin_user1_email = "admin-1@test.com"
    admin_user2_email = "admin-2@test.com"

    member_user = create(:user)
    admin_user1 = create(:user, email: admin_user1_email)
    admin_user2 = create(:user, email: admin_user2_email)

    artist_page = create(:artist_page, owners: [member_user, admin_user1, admin_user2])

    ownership = PageOwnership.find_by(user_id: admin_user1.id, artist_page_id: artist_page.id)
    ownership.update(role: "admin")
    ownership = PageOwnership.find_by(user_id: admin_user2.id, artist_page_id: artist_page.id)
    ownership.update(role: "admin")

    amount_in_cents = 1641
    arrival_date = DateTime.now
    described_class.new.perform(artist_page, amount_in_cents, arrival_date)

    expect(SendBatchEmail).to have_received(:call).with(
      [
        {
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: admin_user1_email,
          template_alias: "artist-paid",
          template_model: {
            artist_name: artist_page.name,
            amount_paid: format("%.2f", amount_in_cents / 100),
            arrival_date_formatted: arrival_date.strftime("%b %d, %Y")
          }
        },
        {
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: admin_user2_email,
          template_alias: "artist-paid",
          template_model: {
            artist_name: artist_page.name,
            amount_paid: format("%.2f", amount_in_cents / 100),
            arrival_date_formatted: arrival_date.strftime("%b %d, %Y")
          }
        }
      ]
    )
  end
end
