require "rails_helper"

describe UpdateArtistOwnerStatusJob, type: :job do
  describe "#perform" do
    let(:artist_page) { create(:artist_page) }

    context "when an artist page isn't eligible to be an artist owner" do
      it "does nothing" do
        expect { described_class.new.perform(artist_page.id) }
          .to_not change { artist_page.reload.artist_owner? }.from(false)
      end
    end

    context "when an artist page is already an artist owner" do
      before(:each) do
        artist_page.update!(artist_owner: true)
      end

      it "does nothing" do
        expect { described_class.new.perform(artist_page.id) }
          .to_not change { artist_page.reload.artist_owner? }.from(true)
      end
    end

    context "when an artist page is not an an artist owner but is eligible for artist ownership" do
      before(:each) do
        10.times { create(:subscription, artist_page: artist_page) }
        allow(ArtistOwnerStatusMailer).to receive(:internal_artist_eligible_for_ownership) do
          double("Message Delivery", deliver_now: true)
        end
        allow(ArtistOwnerStatusMailer).to receive(:artist_eligible_for_ownership) do
          double("Message Delivery", deliver_now: true)
        end
      end

      it "updates the artist_owner column to true" do
        expect { described_class.new.perform(artist_page.id) }
          .to change { artist_page.reload.artist_owner? }.from(false).to(true)
      end

      it "sends internal_artist_eligible_for_ownership email" do
        message_delivery_double = double("Message Delivery")
        expect(message_delivery_double).to receive(:deliver_now)
        expect(ArtistOwnerStatusMailer).to(
          receive(:internal_artist_eligible_for_ownership).with(artist_page)
            .and_return(message_delivery_double)
        )

        described_class.new.perform(artist_page.id)
      end

      it "sends artist_eligible_for_ownership email" do
        message_delivery_double = double("Message Delivery")
        expect(message_delivery_double).to receive(:deliver_now)
        expect(ArtistOwnerStatusMailer).to(
          receive(:artist_eligible_for_ownership).with(artist_page)
            .and_return(message_delivery_double)
        )

        described_class.new.perform(artist_page.id)
      end
    end
  end
end
