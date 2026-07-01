#!/bin/sh
set -e

# Railway injecte le port via la variable d'env $PORT.
# En local (docker compose), on peut définir un défaut.
export PORT="${PORT:-8080}"

# Remplace ${PORT} dans le template nginx par la vraie valeur
envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

# Lance nginx + php-fpm ensemble via supervisord
exec supervisord -c /etc/supervisord.conf
