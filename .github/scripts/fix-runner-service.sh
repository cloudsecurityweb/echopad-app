#!/bin/bash

# Fix GitHub Actions Runner Service Issue
# Run this on your RHEL server

set -e

RUNNER_DIR="$HOME/actions-runner"

echo " Fixing GitHub Actions Runner Service"
echo ""

# Check if runner directory exists
if [ ! -d "$RUNNER_DIR" ]; then
    echo " Runner directory not found: $RUNNER_DIR"
    exit 1
fi

cd "$RUNNER_DIR"

# Check if runsvc.sh exists
if [ ! -f "runsvc.sh" ]; then
    echo " runsvc.sh not found in $RUNNER_DIR"
    exit 1
fi

# Fix permissions
echo "Setting correct permissions..."
chmod +x runsvc.sh
chmod +x run.sh
chmod +x config.sh
chmod +x bin/Runner.Listener
chmod +x bin/Runner.Worker

# Check the service file
echo ""
echo "Checking service file..."
SERVICE_FILE="/etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service"

if [ -f "$SERVICE_FILE" ]; then
    echo "Service file found: $SERVICE_FILE"
    echo ""
    echo "Current ExecStart:"
    grep "ExecStart=" "$SERVICE_FILE"
    echo ""
    
    # Check if the path is correct
    if grep -q "ExecStart=$RUNNER_DIR/runsvc.sh" "$SERVICE_FILE"; then
        echo " Service file path looks correct"
    else
        echo "  Service file path might be incorrect"
        echo "Expected: ExecStart=$RUNNER_DIR/runsvc.sh"
    fi
else
    echo "  Service file not found: $SERVICE_FILE"
fi

# Check if runsvc.sh has correct shebang
echo ""
echo "Checking runsvc.sh shebang..."
head -1 runsvc.sh

# Try to reinstall the service
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Reinstalling service..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Stop and remove old service
sudo systemctl stop actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service 2>/dev/null || true
sudo systemctl disable actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service 2>/dev/null || true

# Reinstall service
sudo ./svc.sh uninstall 2>/dev/null || true
sudo ./svc.sh install

echo ""
echo "Starting service..."
sudo ./svc.sh start

echo ""
echo "Checking service status..."
sleep 2
sudo ./svc.sh status

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Service fix complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If still having issues, check:"
echo "  sudo journalctl -u actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service -n 50"
echo ""
