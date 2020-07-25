namespace :scheduled_destruction do

  desc "Destroys artist pages whose permanently_delete_at time has passed"
  task artist_pages: [:environment] do
    puts "Destroying artist pages scheduled for permanent deletion"
    ArtistPage.where("permanently_delete_at < ?", DateTime.now).each do |ap|
      begin
        ap.subscriptions.each(&:cancel!)
        ap.destroy
        puts "Destroyed artist page with id: #{ap.id}"
      rescue StandardError => e
        puts "Error destroying artist page with id: #{ap.id}"
      end
    end
  end
end
