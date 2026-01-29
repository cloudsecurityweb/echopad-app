#!/bin/bash

# GitHub Actions Runner Setup Script for RHEL
# Run this script on your RHEL server after connecting via SSH

set -e

REPO="cloudsecurityweb/echopad-website"
RUNNER_NAME="echopad-prod-runner"

echo "🚀 GitHub Actions Runner Setup for RHEL"
echo "Repository: $REPO"
echo "Runner Name: $RUNNER_NAME"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Running as root. Some commands will run without sudo."
    SUDO=""
else
    SUDO="sudo"
    echo "✅ Running as regular user (will use sudo when needed)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Update System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

$SUDO dnf update -y

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Install Prerequisites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Install basic tools
echo "Installing basic tools (git, wget, curl, unzip)..."
$SUDO dnf install -y git wget curl unzip

# Install Node.js 20
echo ""
echo "Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | $SUDO bash -
    $SUDO dnf install -y nodejs
else
    echo "Node.js already installed: $(node --version)"
fi

# Verify Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ ^v20\. ]]; then
    echo "⚠️  Warning: Node.js 20 is recommended, but found $NODE_VERSION"
fi

# Install Azure CLI
echo ""
echo "Installing Azure CLI..."
if ! command -v az &> /dev/null; then
    curl -sL https://aka.ms/InstallAzureCLIRHEL | $SUDO bash
else
    echo "Azure CLI already installed: $(az --version | head -n1)"
fi

# Install zip (for deployment packages)
echo ""
echo "Installing zip..."
$SUDO dnf install -y zip

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Verify Installations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Git: $(git --version)"
echo "Azure CLI: $(az --version | head -n1)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Setup GitHub Actions Runner"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create actions-runner directory
RUNNER_DIR="$HOME/actions-runner"
if [ -d "$RUNNER_DIR" ]; then
    echo "⚠️  Runner directory already exists: $RUNNER_DIR"
    read -p "Remove and reinstall? (y/n): " reinstall
    if [ "$reinstall" = "y" ]; then
        $SUDO rm -rf "$RUNNER_DIR"
    else
        echo "Skipping runner installation. Directory exists."
        exit 0
    fi
fi

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

echo ""
echo "📥 Downloading GitHub Actions Runner..."
echo ""

# Get latest runner version
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')
RUNNER_VERSION=${RUNNER_VERSION#v}  # Remove 'v' prefix

echo "Latest runner version: $RUNNER_VERSION"

# Download runner
RUNNER_URL="https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"

echo "Downloading from: $RUNNER_URL"
wget -q "$RUNNER_URL" -O actions-runner.tar.gz

echo "Extracting..."
tar xzf actions-runner.tar.gz
rm actions-runner.tar.gz

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Configure Runner"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "To configure the runner, you need a registration token from GitHub."
echo ""
echo "Get the token from:"
echo "  https://github.com/$REPO/settings/actions/runners/new"
echo ""
echo "Or run this command to get instructions:"
echo "  gh runner create --repo $REPO --name $RUNNER_NAME"
echo ""

read -p "Enter the registration token from GitHub: " REGISTRATION_TOKEN

if [ -z "$REGISTRATION_TOKEN" ]; then
    echo "❌ Registration token is required"
    exit 1
fi

echo ""
echo "Configuring runner..."
./config.sh \
    --url "https://github.com/$REPO" \
    --token "$REGISTRATION_TOKEN" \
    --name "$RUNNER_NAME" \
    --work "_work" \
    --replace

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6: Install as Service (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Install runner as a systemd service? (y/n): " install_service

if [ "$install_service" = "y" ]; then
    echo "Installing as service..."
    $SUDO ./svc.sh install
    
    echo "Starting service..."
    $SUDO ./svc.sh start
    
    echo "Checking service status..."
    $SUDO ./svc.sh status
    
    echo ""
    echo "✅ Runner installed as service!"
    echo ""
    echo "Service commands:"
    echo "  sudo ./svc.sh start    - Start the runner"
    echo "  sudo ./svc.sh stop     - Stop the runner"
    echo "  sudo ./svc.sh status   - Check status"
    echo "  sudo ./svc.sh restart  - Restart the runner"
else
    echo ""
    echo "To run the runner manually, use:"
    echo "  cd $RUNNER_DIR"
    echo "  ./run.sh"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Runner directory: $RUNNER_DIR"
echo "Runner name: $RUNNER_NAME"
echo ""
echo "Verify runner is online at:"
echo "  https://github.com/$REPO/settings/actions/runners"
echo ""
