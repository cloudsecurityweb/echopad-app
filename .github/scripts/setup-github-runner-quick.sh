#!/bin/bash

# Quick GitHub Actions Runner Setup (Manual Steps)
# Run this on your RHEL server

set -e

REPO="cloudsecurityweb/echopad-website"

echo " Quick GitHub Actions Runner Setup"
echo ""

# Step 1: Update and install prerequisites
echo "Step 1: Installing prerequisites..."
sudo dnf update -y
sudo dnf install -y git wget curl unzip zip

# Step 2: Install Node.js 20
echo ""
echo "Step 2: Installing Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Step 3: Install Azure CLI
echo ""
echo "Step 3: Installing Azure CLI..."
curl -sL https://aka.ms/InstallAzureCLIRHEL | sudo bash

# Step 4: Verify
echo ""
echo "Step 4: Verifying installations..."
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Git: $(git --version)"
echo "Azure CLI: $(az --version | head -n1)"

# Step 5: Download and configure runner
echo ""
echo "Step 5: Setting up GitHub Actions Runner..."
echo ""
echo "Create runner directory..."
mkdir -p ~/actions-runner && cd ~/actions-runner

echo "Downloading latest runner..."
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")' | sed 's/v//')

# Detect architecture
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    RUNNER_ARCH="arm64"
    echo "Detected ARM64 architecture"
else
    RUNNER_ARCH="x64"
    echo "Detected x64 architecture"
fi

wget -q "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz" -O actions-runner.tar.gz

echo "Extracting..."
tar xzf actions-runner.tar.gz
rm actions-runner.tar.gz

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Prerequisites installed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Get registration token from GitHub:"
echo "   https://github.com/$REPO/settings/actions/runners/new"
echo ""
echo "2. Configure the runner:"
echo "   cd ~/actions-runner"
echo "   ./config.sh --url https://github.com/$REPO --token <YOUR_TOKEN> --name echopad-prod-runner"
echo ""
echo "3. Install as service (optional):"
echo "   sudo ./svc.sh install"
echo "   sudo ./svc.sh start"
echo ""
echo "4. Or run manually:"
echo "   ./run.sh"
echo ""
