class AddLoginRedirectUrlToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :login_redirect_url, :string
  end
end
