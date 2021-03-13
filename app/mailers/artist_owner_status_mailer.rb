class ArtistOwnerStatusMailer < PostmarkMailer
  # method name must match alias on postmark
  def internal_artist_eligible_for_ownership(artist_page)
    self.template_model = {
      artist_name: artist_page.name,
      artist_page_url: artist_page.url,
      page_owners: artist_page.owners.map { |user| { name: user.name, email: user.email } }
    }

    mail to: ["hello@ampled.com", "austin@ampled.com"]
  end

  def artist_eligible_for_ownership(artist_page)
    self.template_model = {}
    mail to: artist_page.owners.pluck(:email)
  end
end
