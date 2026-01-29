#!/bin/bash

# Fix service error 217/USER
# This means systemd can't find the user

set -e

SERVICE_FILE="/etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service"

echo "🔧 Fixing service error 217/USER"
echo ""

# Check current user
echo "Current user info:"
whoami
id

# Check what user is in service file
echo ""
echo "Service file User setting:"
grep "^User=" "$SERVICE_FILE" || echo "User not found"

# Get the actual username (first part before @)
ACTUAL_USER=$(whoami | cut -d'@' -f1)
echo ""
echo "Detected username: $ACTUAL_USER"

# Check if user exists
if id "$ACTUAL_USER" &>/dev/null; then
    echo "✅ User $ACTUAL_USER exists"
else
    echo "❌ User $ACTUAL_USER does not exist"
    echo "Checking all users..."
    getent passwd | grep -E "(sandeepd|azureuser)" || echo "No matching users found"
fi

# Try to fix - use the actual current user
CURRENT_USER=$(whoami)
echo ""
echo "Setting service to use: $CURRENT_USER"

# Update service file
sudo sed -i "s/^User=.*/User=$CURRENT_USER/" "$SERVICE_FILE"

# If that doesn't work, try just the username part
if [ "$CURRENT_USER" != "$ACTUAL_USER" ]; then
    echo "Also trying with: $ACTUAL_USER"
    sudo sed -i "s/^User=.*/User=$ACTUAL_USER/" "$SERVICE_FILE"
fi

echo ""
echo "Updated service file:"
grep "^User=" "$SERVICE_FILE"

# Reload and restart
echo ""
echo "Reloading systemd..."
sudo systemctl daemon-reload

echo "Starting service..."
sudo systemctl start actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

echo ""
echo "Checking status..."
sleep 2
sudo systemctl status actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service --no-pager -l
