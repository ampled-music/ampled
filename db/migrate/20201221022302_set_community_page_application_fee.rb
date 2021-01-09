class SetCommunityPageApplicationFee < ActiveRecord::Migration[5.2]
  COMMUNITY_PAGE_ID = 354

  def up
    return unless Rails.env.production?

    UpdateApplicationFeePercentJob.perform_async(COMMUNITY_PAGE_ID, 100)
  end
end
