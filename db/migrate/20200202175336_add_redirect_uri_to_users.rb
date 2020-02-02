class AddRedirectUriToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :redirect_uri, :string
  end
end
