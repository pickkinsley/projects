#!/bin/bash
# Deployment Script for Jones County XC
# Run this from your local machine to deploy to the server

set -e

# Configuration - UPDATE THESE
SERVER_USER="ubuntu"
SERVER_IP="44.215.111.88"
SSH_KEY="~/.ssh/lightsail.pem"

# Paths
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"

# SSH command helper
SSH_CMD="ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
SCP_CMD="scp -i $SSH_KEY"

echo "=== Jones County XC Deployment ==="
echo "Server: $SERVER_USER@$SERVER_IP"
echo ""

# Build frontend
echo "=== Building frontend ==="
cd "$FRONTEND_DIR"
npm ci
npm run build
echo "Frontend built successfully"

# Build backend
echo "=== Building backend ==="
cd "$BACKEND_DIR"
GOOS=linux GOARCH=amd64 go build -o server main.go
echo "Backend built successfully"

# Deploy frontend
echo "=== Deploying frontend ==="
$SCP_CMD -r "$FRONTEND_DIR/dist/"* "$SERVER_USER@$SERVER_IP:/var/www/jonescountyxc/"
echo "Frontend deployed"

# Deploy backend
echo "=== Deploying backend ==="
$SCP_CMD "$BACKEND_DIR/server" "$SERVER_USER@$SERVER_IP:~/backend/"
$SCP_CMD "$BACKEND_DIR/go.mod" "$SERVER_USER@$SERVER_IP:~/backend/"
echo "Backend deployed"

# Restart backend service
echo "=== Restarting backend service ==="
$SSH_CMD "sudo systemctl restart jonescountyxc"
echo "Backend restarted"

# Verify
echo "=== Verifying deployment ==="
$SSH_CMD "sudo systemctl status jonescountyxc --no-pager -l" || true

echo ""
echo "=== Deployment complete ==="
echo "Visit http://$SERVER_IP to see your app"
