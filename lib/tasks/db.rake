namespace :db do
  desc "Dumps the database to backups with specified backup name"
  task :dump, [:name] => [:environment] do |task,args|
      cmd = nil
      with_config do | host, db |
          cmd = "pg_dump -F c -v -h #{host} -d #{db} -f #{Rails.root}/db/backups/#{args[:name]}.psql"
      end
      puts cmd
      exec cmd
  end

  desc "Restores the database from backups"
  task :restore, [:name] => :environment do |task,args|
      if args.name.present?
          restoreCmd = nil
          dropCmd = nil
          createCmd = nil
          with_config do | host, db |
              restoreCmd = "pg_restore -F c -v -d #{db} #{Rails.root}/db/backups/#{args[:name]}.psql"
              dropCmd = "dropdb #{db}"
              createCmd = "createdb #{db}"
          end
          cmd = "#{dropCmd} && #{createCmd} && #{restoreCmd}"
          puts cmd
          exec cmd
      else
          puts 'Please provide backup name to restore.'
      end
  end

  private

  def with_config
    yield ActiveRecord::Base.connection_config[:host],
    ActiveRecord::Base.connection_config[:database]
  end
end
