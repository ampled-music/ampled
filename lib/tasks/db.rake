namespace :db do
  desc "Load a small, representative set of data so that the application can start in an use state (for development)."
  task sample_data: :environment do
    sample_data = Rails.root.join("db", "sample_data.rb")
    load(sample_data) if sample_data
  end

  desc "Dumps the database to backups with specified backup name"
  task :dump, [:name] => [:environment] do |task,args|
      cmd = nil
      with_config do |app, host, db, user|
          cmd = "pg_dump -F c -v -h #{host} -d #{db} -f #{Rails.root}/db/backups/#{args[:name]}.psql"
      end
      puts cmd
      exec cmd
  end

  desc "Restores the database from backups"
  task :restore, [:name] => :environment do |task,args|
      if args.name.present?
          cmd = nil
          with_config do |app, host, db, user|
              cmd = "pg_restore -F c -v -d #{db} #{Rails.root}/db/backups/#{args[:name]}.psql"
          end
          Rake::Task["db:drop"].invoke
          Rake::Task["db:create"].invoke
          puts cmd
          exec cmd
      else
          puts 'Please provide backup name to restore.'
      end
  end

  private

  def with_config
      yield Rails.application.class.parent_name.underscore,
      ActiveRecord::Base.connection_config[:host],
      ActiveRecord::Base.connection_config[:database],
      ActiveRecord::Base.connection_config[:username]
  end
end
