require "rails_helper"

RSpec.describe Contributor, type: :model do
  it "is not valid without a user" do
    contributor = Contributor.new(user: nil)
    expect(contributor).to_not be_valid
  end
end
