#!/bin/sh
set -e

# Railway injecte le port via la variable d'env $PORT.
# En local (docker compose), on peut définir un défaut.
export PORT="${PORT:-8080}"

# Remplace ${PORT} dans le template nginx par la vraie valeur
envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

# Régénère le cache de config/routes/vues MAINTENANT, au runtime,
# quand les vraies variables d'environnement Railway sont disponibles.
# On clear d'abord au cas où un vieux cache aurait été copié par erreur.
cd /var/www/api

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Lance nginx + php-fpm ensemble via supervisord
exec supervisord -c /etc/supervisord.conf
