#!/bin/bash

# Fix script for ARM64 runner - Run this on your RHEL server

set -e

REPO="cloudsecurityweb/echopad-website"

echo " Fixing GitHub Actions Runner for ARM64"
echo ""

# Remove old x64 runner
echo "Removing old x64 runner..."
cd ~
if [ -d "actions-runner" ]; then
    rm -rf actions-runner
    echo " Removed old runner"
fi

# Create new directory
echo "Creating new runner directory..."
mkdir -p ~/actions-runner && cd ~/actions-runner

# Get latest version
echo "Getting latest runner version..."
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")' | sed 's/v//')

echo "Latest version: $RUNNER_VERSION"
echo "Downloading ARM64 runner..."

# Download ARM64 version
wget "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-arm64-${RUNNER_VERSION}.tar.gz" -O actions-runner.tar.gz

echo "Extracting..."
tar xzf actions-runner.tar.gz
rm actions-runner.tar.gz

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ARM64 runner downloaded!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now configure the runner:"
echo "  cd ~/actions-runner"
echo "  ./config.sh --url https://github.com/$REPO --token <YOUR_TOKEN> --name echopad-prod-runner"
echo ""
