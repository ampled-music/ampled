require "rails_helper"

RSpec.describe AudioProcessingService, type: :service do
  describe "initialize" do
    context "when public_id provided" do
      let(:public_id) { "abc.mp3" }
      let(:s3_bucket) { double }
      let(:s3_object) { double }
      let(:s3_object_resource) { double }
      let(:process_id) { SecureRandom.uuid }

      before(:each) do
        allow(SecureRandom)
          .to receive(:uuid)
          .and_return(process_id)

        s3 = double
        allow(Aws::S3::Resource)
          .to receive(:new)
          .and_return(s3)

        allow(s3)
          .to receive(:bucket)
          .with(ENV["S3_BUCKET"])
          .and_return(s3_bucket)

        allow(s3_bucket)
          .to receive(:object)
          .with(public_id)
          .and_return(s3_object)

        allow(s3_object)
          .to receive(:exists?)
          .and_return(true)

        allow(s3_object)
          .to receive(:get)
          .and_return(s3_object_resource)

        described_class.new(public_id)
      end

      it "should get s3 object with public_id" do
        expect(s3_bucket).to have_received(:object).with(public_id)
      end

      it "should generate new uuid" do
        expect(SecureRandom).to have_received(:uuid)
      end

      it "should write file to correct path and filename" do
        expect(s3_object)
          .to have_received(:get)
          .with(response_target: Rails.root.join("tmp/raw_#{process_id}"))
      end
    end
  end

  describe "generate_hash" do
    context "generate sha256" do
      let(:public_id) { "abc.mp3" }
      let(:process_id) { SecureRandom.uuid }
      let(:raw_file_path) { Rails.root.join("tmp/raw_#{process_id}") }
      let(:sha256) { double }
      let(:hexdigest) { "hexhash" }

      before(:each) do
        allow(SecureRandom)
          .to receive(:uuid)
          .and_return(process_id)

        s3 = double
        allow(Aws::S3::Resource)
          .to receive(:new)
          .and_return(s3)

        s3_bucket = double
        allow(s3)
          .to receive(:bucket)
          .with(ENV["S3_BUCKET"])
          .and_return(s3_bucket)

        s3_object = double
        allow(s3_bucket)
          .to receive(:object)
          .with(public_id)
          .and_return(s3_object)

        allow(s3_object)
          .to receive(:exists?)
          .and_return(true)

        s3_object_resource = double
        allow(s3_object)
          .to receive(:get)
          .and_return(s3_object_resource)

        allow(Digest::SHA256)
          .to receive(:file)
          .and_return(sha256)

        allow(sha256)
          .to receive(:hexdigest)
          .and_return(hexdigest)
      end

      it "should call digest sha256" do
        described_class.new(public_id).generate_hash

        expect(Digest::SHA256)
          .to have_received(:file)
          .with(raw_file_path)
      end

      it "should return hexdigest" do
        hash = described_class.new(public_id).generate_hash

        expect(hash)
          .to equal(hexdigest)
      end
    end
  end

  describe "duration" do
    context "generate sha256" do
      let(:public_id) { "abc.mp3" }
      let(:process_id) { SecureRandom.uuid }
      let(:raw_file_path) { Rails.root.join("tmp/raw_#{process_id}") }
      let(:duration) { 124_314.12 }

      before(:each) do
        allow(SecureRandom)
          .to receive(:uuid)
          .and_return(process_id)

        s3 = double
        allow(Aws::S3::Resource)
          .to receive(:new)
          .and_return(s3)

        s3_bucket = double
        allow(s3)
          .to receive(:bucket)
          .with(ENV["S3_BUCKET"])
          .and_return(s3_bucket)

        s3_object = double
        allow(s3_bucket)
          .to receive(:object)
          .with(public_id)
          .and_return(s3_object)

        allow(s3_object)
          .to receive(:exists?)
          .and_return(true)

        s3_object_resource = double
        allow(s3_object)
          .to receive(:get)
          .and_return(s3_object_resource)

        allow(FFMPEG)
          .to receive(:probe)
          .with(raw_file_path, "duration")
          .and_return(duration)
      end

      it "should call ffmpeg probe" do
        described_class.new(public_id).duration
        expect(FFMPEG)
          .to have_received(:probe)
          .with(raw_file_path, "duration")
      end

      it "should return duration as integer" do
        result = described_class.new(public_id).duration

        expect(result).to equal(duration.to_i)
      end
    end
  end

  describe "generate_waveform" do
    context "waveform" do
      let(:public_id) { "abc.mp3" }
      let(:process_id) { SecureRandom.uuid }
      let(:raw_file_path) { Rails.root.join("tmp/raw_#{process_id}") }
      let(:downsampled_file_path) { Rails.root.join("tmp/downsampled_#{process_id}.wav") }
      let(:wavefile_reader) { double }
      let(:buffer) { double }
      let(:waveform_length) { 3 }

      before(:each) do
        allow(SecureRandom)
          .to receive(:uuid)
          .and_return(process_id)

        s3 = double
        allow(Aws::S3::Resource)
          .to receive(:new)
          .and_return(s3)

        s3_bucket = double
        allow(s3)
          .to receive(:bucket)
          .with(ENV["S3_BUCKET"])
          .and_return(s3_bucket)

        s3_object = double
        allow(s3_bucket)
          .to receive(:object)
          .with(public_id)
          .and_return(s3_object)

        allow(s3_object)
          .to receive(:exists?)
          .and_return(true)

        s3_object_resource = double
        allow(s3_object)
          .to receive(:get)
          .and_return(s3_object_resource)

        allow(FFMPEG).to receive(:run)

        allow(File)
          .to receive(:exist?)
          .and_return(true)

        allow(WaveFile::Reader)
          .to receive(:new)
          .and_return(wavefile_reader)

        allow(wavefile_reader)
          .to receive(:total_sample_frames)
          .and_return(10)

        allow(wavefile_reader)
          .to receive(:current_sample_frame)
          .and_return(0, 3, 6, 10)

        allow(wavefile_reader)
          .to receive(:read)
          .and_return(buffer)

        allow(wavefile_reader)
          .to receive(:close)

        allow(buffer)
          .to receive(:samples)
          .and_return([128, 129, 126], [131, 124, 133], [134, 135, 136, 119])
      end

      it "should call ffmpeg run" do
        described_class.new(public_id).generate_waveform(waveform_length)
        expect(FFMPEG)
          .to have_received(:run)
          .with(raw_file_path, downsampled_file_path, "pcm_u8", 1000, 1)
      end

      it "should raise error if ffmpeg output file does not exist" do
        allow(File)
          .to receive(:exist?)
          .and_return(false)

        expect {
          described_class.new(public_id).generate_waveform(waveform_length)
        }.to raise_error(AudioProcessingService::FfmpegError)
      end

      it "should generate waveform of correct length" do
        waveform = described_class.new(public_id).generate_waveform(waveform_length)
        expect(waveform.size).to equal(waveform_length)
      end

      it "should generate correct waveform values" do
        service = described_class.new(public_id)
        waveform = service.generate_waveform(waveform_length)
        expected_waveform = [121, 124, 128]

        expect(waveform).to match_array(expected_waveform)
      end
    end
  end

  describe "dispose" do
    context "when disposing service" do
      let(:public_id) { "abc.mp3" }
      let(:process_id) { SecureRandom.uuid }
      let(:raw_file_path) { Rails.root.join("tmp/raw_#{process_id}") }

      before(:each) do
        allow(SecureRandom)
          .to receive(:uuid)
          .and_return(process_id)

        s3 = double
        allow(Aws::S3::Resource)
          .to receive(:new)
          .and_return(s3)

        s3_bucket = double
        allow(s3)
          .to receive(:bucket)
          .with(ENV["S3_BUCKET"])
          .and_return(s3_bucket)

        s3_object = double
        allow(s3_bucket)
          .to receive(:object)
          .with(public_id)
          .and_return(s3_object)

        allow(s3_object)
          .to receive(:exists?)
          .and_return(true)

        s3_object_resource = double
        allow(s3_object)
          .to receive(:get)
          .and_return(s3_object_resource)

        allow(File)
          .to receive(:exist?)
          .and_return(true)

        allow(File)
          .to receive(:delete)
      end

      it "should delete raw file" do
        described_class.new(public_id).dispose

        expect(File)
          .to have_received(:delete)
          .with(raw_file_path)
      end

      it "should delete downsampled file" do
        service = described_class.new(public_id)
        service.instance_variable_set(:@downsampled_file_path, "test")
        service.dispose

        expect(File)
          .to have_received(:delete)
          .with("test")
      end
    end
  end
end
