class ArtistPagePaidEmailJob
  include Sidekiq::Worker
  attr_accessor :artist_name :email_recipients :amount_in_cents :arrival_date

  def perform(artist_page, amount_in_cents, arrival_date)
    return if artist_page.nil?
    return if amount_in_cents <= 0
    return if arrival_date.nil?

    ownership_roles = PageOwnership.find_by(artist_page_id: artist_page.id)
    admin_user_ids = ownership_roles.select(&:is_admin).map(&:user_id)
    if admin_user_ids.empty?
      logger.error("No admin users found for artist page with id: #{artist_page.id}.")
      return
    end

    @artist_name = artist_page.name
    @email_recipients = artist_page.owners.select(admin_user_ids.include?(&:id)).map(&:email)
    @amount_in_cents = amount_in_cents
    @arrival_date = arrival_date

    SendBatchEmail.call(messages)
  end

  private
  
  def messages
    email_recipients.map do |email_to|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: email_to,
        template_alias: "artist-paid",
        template_model: {
          artist_name: artist_name,
          amount_paid: format("%.2f", amount_in_cents / 100),
          arrival_date_formatted: arrival_date.strftime("%b %d, %Y")
        }
      }
    end
  end
end
  