module Test
  class DatabasesController < ApplicationController
    skip_before_action :verify_authenticity_token

    def reset
      truncate_tables
      seed_data

      render json: { truncated: true, seeded: true }
    end

    private

    def truncate_tables
      tables = ActiveRecord::Base.connection.tables.filter { |t| t != "schema_migrations" }
      tables.each { |t| ActiveRecord::Base.connection.execute("TRUNCATE #{t} CASCADE") }
    end

    def seed_data
      DummyData.create_all
    end
  end
end
