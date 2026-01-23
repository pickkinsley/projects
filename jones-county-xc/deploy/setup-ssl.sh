#!/bin/bash
# SSL Setup Script using Let's Encrypt
# Run this on the server after your domain is pointing to the server

set -e

if [ -z "$1" ]; then
    echo "Usage: ./setup-ssl.sh your-domain.com"
    exit 1
fi

DOMAIN=$1

echo "=== Installing Certbot ==="
sudo apt install -y certbot python3-certbot-nginx

echo "=== Obtaining SSL certificate for $DOMAIN ==="
sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN"

echo "=== Setting up auto-renewal ==="
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo ""
echo "=== SSL setup complete ==="
echo "Your site is now available at https://$DOMAIN"
echo "Certificates will auto-renew via certbot.timer"
