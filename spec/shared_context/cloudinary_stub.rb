RSpec.shared_context "cloudinary_stub" do
  before(:each) do
    allow(Cloudinary::Uploader)
      .to receive(:destroy)
      .and_return({})
  end
end
