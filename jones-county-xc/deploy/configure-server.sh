#!/bin/bash
# Server Configuration Script
# Run this on the server after server-setup.sh to configure nginx and systemd

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Configuring nginx ==="
sudo cp "$SCRIPT_DIR/nginx.conf" /etc/nginx/sites-available/jonescountyxc
sudo ln -sf /etc/nginx/sites-available/jonescountyxc /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
echo "nginx configured"

echo "=== Configuring systemd service ==="
sudo cp "$SCRIPT_DIR/jonescountyxc.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable jonescountyxc
echo "systemd service configured"

echo ""
echo "=== Configuration complete ==="
echo ""
echo "IMPORTANT: Update the service file with your database password:"
echo "  sudo nano /etc/systemd/system/jonescountyxc.service"
echo "  sudo systemctl daemon-reload"
echo ""
echo "Then run deploy.sh from your local machine to deploy the app"
