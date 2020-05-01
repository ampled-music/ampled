require "rails_helper"

RSpec.describe Image, type: :model do
  subject { described_class.new }

  describe "#imageable" do
    let(:artist_page) { create(:artist_page) }
    let(:user) { create(:user) }

    it "is a polymorphic relationship that supports different model types" do
      [artist_page, user].each do |some_imageable|
        subject.imageable = some_imageable
        subject.save!
        expect(subject.reload.imageable_type).to eq(some_imageable.class.name)
      end
    end
  end
end
