require "rails_helper"

describe ArtistPaidEmailJob, type: :job do
  it "raises an error if artist page is not found" do
    allow(ArtistPage).to receive(:find_by) { nil }
    connect_account_id = "acc_123"
    expect {
      described_class.new.perform(connect_account_id, 1234, "usd", DateTime.now)
    }.to raise_error("Artist not found for stripe user id: #{connect_account_id}")
  end

  it "raises an error if connect account is not found" do
    allow(Stripe::Account).to receive(:retrieve) { nil }
    connect_account_id = "acc_123"
    create(:artist_page, stripe_user_id: connect_account_id)

    expect {
      described_class.new.perform(connect_account_id, 1234, "usd", DateTime.now)
    }.to raise_error("Connect account not found for id: #{connect_account_id}")
  end

  it "sends an email to the connect account holder" do
    allow(SendBatchEmail).to receive(:call)

    connect_account_id = "acc_123"
    artist_page = create(:artist_page, stripe_user_id: connect_account_id)

    connect_account = double
    allow(connect_account).to receive(:email).and_return("connect-account@test.com")
    allow(Stripe::Account).to receive(:retrieve) { connect_account }

    amount_in_cents = 1641
    currency = "usd"
    arrival_epoch_time = 1_586_744_761
    described_class.new.perform(connect_account_id, amount_in_cents, currency, arrival_epoch_time)

    arrival_date = DateTime.strptime(arrival_epoch_time.to_s, "%s")
    arrival_date_formatted = arrival_date.strftime("%b %d, %Y")

    expect(SendBatchEmail).to have_received(:call).with(
      [
        {
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: connect_account.email,
          template_alias: "artist-paid",
          template_model: {
            artist_name: artist_page.name,
            amount_paid: format("%.2f", amount_in_cents / 100.0),
            currency_name: currency.upcase,
            arrival_date_formatted: arrival_date_formatted
          }
        }
      ]
    )
  end
end
