require "rails_helper"

RSpec.describe AudioUpload, type: :model do
  describe "before create" do
    let(:post) { create(:post) }
    let(:audio_processing_service) { double }

    before(:each) do
      allow(AudioProcessingService).to receive(:new) { audio_processing_service }
      allow(audio_processing_service).to receive(:dispose)
    end

    context "when audio processing service generates empty hash_key" do
      before do
        allow(audio_processing_service).to receive(:generate_hash) { "" }
      end

      it "should raise HashGenerationError" do
        expect {
          post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
          post.save!
        }.to raise_error(AudioUpload::HashGenerationError)
      end
    end

    context "when audio processing service finds a duration of 0" do
      before do
        allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
        allow(audio_processing_service).to receive(:duration) { 0 }
      end

      it "should raise DurationNotFoundError" do
        expect {
          post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
          post.save!
        }.to raise_error(AudioUpload::DurationNotFoundError)
      end
    end

    context "when audio processing service generates empty waveform" do
      before do
        allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
        allow(audio_processing_service).to receive(:duration) { 123 }
        allow(audio_processing_service).to receive(:generate_waveform) { [] }
      end

      it "should raise WaveformEmptyError" do
        expect {
          post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
          post.save!
        }.to raise_error(AudioUpload::WaveformEmptyError)
      end
    end
  end

  describe "before destroy" do
    context "when audio upload is set to be destroyed" do
      let(:post) { create(:post) }
      let(:s3) { double }
      let(:bucket) { double }
      let(:object) { double }

      before(:each) do
        audio_processing_service = double
        allow(AudioProcessingService).to receive(:new) { audio_processing_service }
        allow(audio_processing_service).to receive(:generate_hash) { "fake_hash" }
        allow(audio_processing_service).to receive(:duration) { 123 }
        allow(audio_processing_service).to receive(:generate_waveform) { [1] }
        allow(audio_processing_service).to receive(:dispose)

        post.audio_uploads << AudioUpload.new(public_id: "abc.mp3")
        post.save!

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
