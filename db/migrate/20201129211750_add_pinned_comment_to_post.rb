class AddPinnedCommentToPost < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :pinned_comment, :bigint
  end
end
