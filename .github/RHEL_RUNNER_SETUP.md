# GitHub Actions Runner Setup on RHEL Server

Complete guide to set up GitHub Actions runner on your RHEL server from Azure.

## Prerequisites

- RHEL server running in Azure
- SSH access to the server
- Public IP address of the server

## Quick Setup (Automated)

### Option 1: Run the setup script

1. **Copy the setup script to your server:**

```bash
# From your local machine, copy the script
scp .github/scripts/setup-github-runner-quick.sh azureuser@<YOUR_VM_IP>:~/
```

2. **SSH into your server:**

```bash
ssh azureuser@<YOUR_VM_IP>
# Or if you have a key file:
ssh -i ~/path/to/key.pem azureuser@<YOUR_VM_IP>
```

3. **Run the setup script:**

```bash
chmod +x setup-github-runner-quick.sh
./setup-github-runner-quick.sh
```

### Option 2: Manual step-by-step

Follow these steps if you prefer manual setup:

## Step 1: Connect to Your RHEL Server

```bash
ssh azureuser@<YOUR_VM_IP>
```

## Step 2: Update System

```bash
sudo dnf update -y
```

## Step 3: Install Prerequisites

```bash
# Install basic tools
sudo dnf install -y git wget curl unzip zip

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIRHEL | sudo bash

# Verify installations
node --version  # Should be v20.x.x
npm --version
git --version
az --version
```

## Step 4: Download GitHub Actions Runner

```bash
# Create directory
mkdir -p ~/actions-runner
cd ~/actions-runner

# Get latest version
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")' | sed 's/v//')

# Download runner
wget https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# Extract
tar xzf actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
rm actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
```

## Step 5: Get Registration Token

1. Go to: https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners
2. Click **"New self-hosted runner"**
3. Select **Linux** as the operating system
4. Copy the **registration token** shown (it looks like: `AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

## Step 6: Configure Runner

```bash
cd ~/actions-runner

./config.sh \
  --url https://github.com/cloudsecurityweb/echopad-website \
  --token <YOUR_REGISTRATION_TOKEN> \
  --name echopad-prod-runner \
  --work _work \
  --replace
```

When prompted:
- **Enter runner name**: `echopad-prod-runner` (or press Enter for default)
- **Enter runner group**: Press Enter (default)
- **Enter labels**: Press Enter (default) or add `self-hosted,linux,rhel`
- **Enter work folder**: Press Enter (default: `_work`)

## Step 7: Install as Service (Recommended)

This makes the runner start automatically on boot:

```bash
cd ~/actions-runner

# Install as service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

### Service Management Commands

```bash
cd ~/actions-runner

# Start runner
sudo ./svc.sh start

# Stop runner
sudo ./svc.sh stop

# Restart runner
sudo ./svc.sh restart

# Check status
sudo ./svc.sh status

# Uninstall service
sudo ./svc.sh uninstall
```

## Step 8: Verify Runner is Online

1. Go to: https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners
2. You should see your runner listed as **"Online"** (green dot)
3. The runner should show as **"Idle"** when not running jobs

## Step 9: Test the Runner

1. Go to: https://github.com/cloudsecurityweb/echopad-website/actions
2. Select any workflow (e.g., `Production Backend Deployment`)
3. Click **"Run workflow"**
4. Select **"Production"** branch
5. Click **"Run workflow"**
6. The job should appear in your runner's queue and execute

## Troubleshooting

### Runner Not Appearing Online

1. **Check if runner process is running:**
   ```bash
   ps aux | grep Runner.Listener
   ```

2. **Check runner logs:**
   ```bash
   cd ~/actions-runner
   tail -f _diag/Runner_*.log
   ```

3. **Restart the service:**
   ```bash
   sudo ./svc.sh restart
   ```

### Jobs Not Running

1. **Check runner is online** in GitHub settings
2. **Check runner logs** for errors
3. **Verify Node.js and Azure CLI** are installed:
   ```bash
   node --version
   az --version
   ```

### Permission Issues

1. **Ensure runner user has permissions:**
   ```bash
   # Check current user
   whoami
   
   # Ensure user can write to work directory
   ls -la ~/actions-runner/_work
   ```

### Network Issues

1. **Check internet connectivity:**
   ```bash
   ping github.com
   curl -I https://github.com
   ```

2. **Check firewall rules** (if any):
   ```bash
   sudo firewall-cmd --list-all
   ```

### Update Runner

To update the runner to the latest version:

```bash
cd ~/actions-runner

# Stop the service
sudo ./svc.sh stop

# Download latest version
RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")' | sed 's/v//')
wget https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
tar xzf actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
rm actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# Restart service
sudo ./svc.sh start
```

## Security Best Practices

1. **Use a dedicated VM** for the runner (not shared with other services)
2. **Keep the runner updated** regularly
3. **Limit network access** - only allow necessary outbound connections
4. **Monitor logs** regularly for suspicious activity
5. **Use service account** - run the service as a non-privileged user
6. **Enable firewall** if needed (but allow GitHub connections)

## Next Steps

Once the runner is set up:

1. ✅ Add GitHub Secrets (see `.github/GITHUB_SECRETS_SETUP.md`)
2. ✅ Push code to `Production` branch
3. ✅ Workflows will automatically use the self-hosted runner
4. ✅ Monitor deployments in GitHub Actions tab

## Useful Commands Reference

```bash
# Check runner status
cd ~/actions-runner && sudo ./svc.sh status

# View logs
tail -f ~/actions-runner/_diag/Runner_*.log

# Restart runner
cd ~/actions-runner && sudo ./svc.sh restart

# Check Node.js version
node --version

# Check Azure CLI
az --version

# Test Azure login
az login

# List GitHub runners (if GitHub CLI installed)
gh runner list --repo cloudsecurityweb/echopad-website
```
