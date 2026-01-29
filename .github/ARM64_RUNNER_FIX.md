# Fix ARM64 Runner Issue

Your VM is ARM64 architecture, but the x64 runner was downloaded. Here's how to fix it.

## Quick Fix

Run these commands on your RHEL server:

```bash
# Remove old x64 runner
cd ~
rm -rf actions-runner

# Create new directory
mkdir -p ~/actions-runner && cd ~/actions-runner

# Get latest version
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")' | sed 's/v//')

# Download ARM64 version (not x64!)
wget "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-arm64-${RUNNER_VERSION}.tar.gz" -O actions-runner.tar.gz

# Extract
tar xzf actions-runner.tar.gz
rm actions-runner.tar.gz

# Now configure
./config.sh --url https://github.com/cloudsecurityweb/echopad-website --token B4TQYSXNPSKYR4JAQNG4L43JPNIT2 --name echopad-prod-runner
```

## Or Use the Fix Script

1. **Copy the fix script to your server:**

```bash
# From your local machine
scp .github/scripts/fix-arm64-runner.sh azureuser@<YOUR_VM_IP>:~/
```

2. **SSH into your server and run:**

```bash
ssh azureuser@<YOUR_VM_IP>
chmod +x fix-arm64-runner.sh
./fix-arm64-runner.sh
```

3. **Then configure:**

```bash
cd ~/actions-runner
./config.sh --url https://github.com/cloudsecurityweb/echopad-website --token B4TQYSXNPSKYR4JAQNG4L43JPNIT2 --name echopad-prod-runner
```

## Verify Architecture

To check your VM architecture:

```bash
uname -m
```

Should show: `aarch64` (which is ARM64)

## After Configuration

Install as service:

```bash
cd ~/actions-runner
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

## Key Difference

- ❌ **Wrong**: `actions-runner-linux-x64-*.tar.gz` (for x64/amd64)
- ✅ **Correct**: `actions-runner-linux-arm64-*.tar.gz` (for ARM64)

The updated script now auto-detects the architecture and downloads the correct version.
