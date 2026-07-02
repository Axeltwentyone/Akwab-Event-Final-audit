#!/bin/sh
set -e

echo ">>> START.SH IS RUNNING <<<"

export PORT="${PORT:-8080}"

envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

cd /var/www/api

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan migrate --force

php artisan db:seed --class=SuperAdminSeeder --force

php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ">>> LAUNCHING SUPERVISORD <<<"
exec supervisord -c /etc/supervisord.conf
