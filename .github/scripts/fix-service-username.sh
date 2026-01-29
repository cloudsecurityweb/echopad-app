#!/bin/bash

# Fix service username issue
# The service file has wrong username format

set -e

SERVICE_FILE="/etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service"

echo "🔧 Fixing service username"
echo ""

# Get current username (without domain)
CURRENT_USER=$(whoami)
echo "Current user: $CURRENT_USER"

# Check current service file
echo ""
echo "Current service file User setting:"
grep "^User=" "$SERVICE_FILE" || echo "User not found"

# Fix the service file
echo ""
echo "Fixing service file..."
sudo sed -i "s/^User=.*/User=$CURRENT_USER/" "$SERVICE_FILE"

echo "✅ Updated service file"
echo ""
echo "New User setting:"
grep "^User=" "$SERVICE_FILE"

# Reload systemd and restart
echo ""
echo "Reloading systemd..."
sudo systemctl daemon-reload

echo "Starting service..."
sudo systemctl start actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

echo ""
echo "Checking status..."
sleep 2
sudo systemctl status actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service --no-pager -l
