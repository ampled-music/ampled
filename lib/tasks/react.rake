namespace :react do
  desc "Builds the React app from client/ into the Rails public/ directory"
  task :build do
    #FileUtils.cd("client") do
    #  system("yarn build") || raise("Failed to build React app")
    #  FileUtils.cp_r("build/.", "../public", verbose: true)
    #end
  end
end

# `task` will enhance the assets:precompile task if it is already defined.
# So the existing sprockets behavior will continue to work.
task "assets:precompile" do
  #Rake::Task["react:build"].invoke
end
