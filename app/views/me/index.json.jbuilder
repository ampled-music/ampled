json.userInfo do
  json.id current_user.id
  json.name current_user.name
end
json.artistPages @owned.concat(@supported) do |page|
  json.artistId page.id
  json.role page.role
end
