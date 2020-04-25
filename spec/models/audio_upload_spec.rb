require "rails_helper"

RSpec.describe AudioUpload, type: :model do
  describe "before destroy" do
    context "when audio upload is set to be destroyed" do
      let(:post) { create(:post, audio_uploads: [AudioUpload.new(public_id: "abc.mp3")]) }
      let(:s3) { double }
      let(:bucket) { double }
      let(:object) { double }

      before(:each) do
        allow(Aws::S3::Resource).to receive(:new) { s3 }
        allow(s3).to receive(:bucket) { bucket }
        allow(bucket).to receive(:object) { object }
        allow(object).to receive(:delete)
        post.destroy
      end

      it "should first delete object from S3" do
        expect(object).to have_received(:delete)
      end
    end
  end
end
