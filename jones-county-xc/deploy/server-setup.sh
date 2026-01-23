#!/bin/bash
# Server Setup Script for Jones County XC
# Run this once on a fresh Lightsail Ubuntu server

set -e

echo "=== Updating system ==="
sudo apt update && sudo apt upgrade -y

echo "=== Installing Go ==="
wget -q https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
rm go1.21.6.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
export PATH=$PATH:/usr/local/go/bin
go version

echo "=== Installing Node.js ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version

echo "=== Installing nginx ==="
sudo apt install -y nginx
sudo systemctl enable nginx

echo "=== Installing MySQL ==="
sudo apt install -y mysql-server
sudo systemctl enable mysql

echo "=== Creating web directory ==="
sudo mkdir -p /var/www/jonescountyxc
sudo chown -R $USER:$USER /var/www/jonescountyxc

echo "=== Creating backend directory ==="
mkdir -p ~/backend

echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "1. Run: sudo mysql_secure_installation"
echo "2. Create database:"
echo "   sudo mysql -e \"CREATE DATABASE jonescountyxc;\""
echo "   sudo mysql -e \"CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD';\""
echo "   sudo mysql -e \"GRANT ALL PRIVILEGES ON jonescountyxc.* TO 'appuser'@'localhost';\""
echo "3. Copy deploy/nginx.conf to /etc/nginx/sites-available/jonescountyxc"
echo "4. Copy deploy/jonescountyxc.service to /etc/systemd/system/"
echo "5. Run deploy.sh from your local machine"
