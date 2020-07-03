json.status "ok"
json.counts do
  json.confirmed_users User.where.not(confirmed_at: nil).count
  json.pending_users User.where(confirmed_at: nil).count
  json.approved_artist_pages ArtistPage.approved.count
  json.pending_artist_pages ArtistPage.where(approved: false).count
  json.active_subscriptions @active_subscription_count
  json.active_subscription_revenue @total_revenue
  json.avg_subscription_amount @avg_subscription_amount
end
