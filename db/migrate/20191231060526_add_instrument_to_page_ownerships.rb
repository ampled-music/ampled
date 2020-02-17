class AddInstrumentToPageOwnerships < ActiveRecord::Migration[5.2]
  def change
    add_column :page_ownerships, :instrument, :string
  end
end
