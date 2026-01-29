#!/bin/bash

# Fix 203/EXEC error - script execution permissions

set -e

RUNNER_DIR="$HOME/actions-runner"

echo " Fixing execution permissions for GitHub Actions Runner"
echo ""

cd "$RUNNER_DIR"

# Check if files exist
echo "Checking files..."
ls -la runsvc.sh run.sh config.sh 2>/dev/null || echo "Some files missing"

# Fix all permissions
echo ""
echo "Setting execute permissions..."
chmod +x runsvc.sh
chmod +x run.sh
chmod +x config.sh
chmod +x bin/Runner.Listener
chmod +x bin/Runner.Worker
chmod +x bin/Runner.PluginHost
chmod +x bin/Runner.Listener.diag

# Check shebang in runsvc.sh
echo ""
echo "Checking runsvc.sh shebang..."
head -1 runsvc.sh

# Verify permissions
echo ""
echo "Verifying permissions..."
ls -la runsvc.sh run.sh config.sh bin/Runner.Listener

# Check SELinux if enabled
echo ""
if command -v getenforce &> /dev/null; then
    SELINUX_STATUS=$(getenforce)
    echo "SELinux status: $SELINUX_STATUS"
    if [ "$SELINUX_STATUS" = "Enforcing" ]; then
        echo "  SELinux is enforcing - might need to set context"
        echo "Trying to fix SELinux context..."
        sudo chcon -t bin_t runsvc.sh 2>/dev/null || echo "Could not set SELinux context"
    fi
fi

# Try to run manually to test
echo ""
echo "Testing if runsvc.sh can execute..."
if bash -n runsvc.sh; then
    echo " runsvc.sh syntax is valid"
else
    echo " runsvc.sh has syntax errors"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Permissions fixed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now try:"
echo "  sudo ./svc.sh start"
echo "  sudo ./svc.sh status"
echo ""
