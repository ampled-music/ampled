#!/bin/sh
cwd=`dirname "$0"`
source "$cwd/reset-config.cfg"

echo "Loading sample data on acceptance (destructive)..."
sleep 3

set -x

heroku pg:reset DATABASE_URL --confirm $ACCEPTANCE
heroku run rake db:migrate -a $ACCEPTANCE
heroku run rake dummy:admin dummy:users dummy:artist_pages dummy:posts -a $ACCEPTANCE
