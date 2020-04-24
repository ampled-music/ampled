json.status "ok"
json.counts do
  json.child! do
    json.name "Confirmed Users"
    json.count User.where.not(confirmed_at: nil).count
  end
  json.child! do
    json.name "Pending Users"
    json.count User.where(confirmed_at: nil).count
  end
  json.child! do
    json.name "Approved Pages"
    json.count ArtistPage.approved.count
  end
  json.child! do
    json.name "Pending Pages"
    json.count ArtistPage.where(approved: false).count
  end
  json.child! do
    json.name "Active Subscriptions"
    json.count Subscription.active.count
  end
  json.child! do
    json.name "Active Subscription Revenue"
    json.count @total_revenue
  end
end
