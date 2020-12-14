require "rails_helper"

RSpec.describe ContributorTime, type: :model do
  it "is not valid without a contributor" do
    contributor_time = ContributorTime.new(contributor: nil)
    expect(contributor_time).to_not be_valid
  end
end
