# Self-Hosted Runner Setup Guide

This guide explains how to set up a self-hosted runner for GitHub Actions in the `sandeepd@deepikachavala2015outlook.onmicrosoft.com` Azure account.

## Prerequisites

- Machine/VM in Azure account: `sandeepd@deepikachavala2015outlook.onmicrosoft.com`
- Operating System: Linux (Ubuntu 20.04+ recommended) or Windows Server
- Node.js 20.x installed
- Azure CLI installed
- Git installed
- Internet connectivity

## Step 1: Create Azure VM (if needed)

If you don't have a VM yet, create one:

```bash
# Login to Azure
az login

# Set subscription (if needed)
az account set --subscription <subscription-id>

# Create resource group
az group create --name github-runner-rg --location eastus

# Create VM (Linux example)
az vm create \
  --resource-group github-runner-rg \
  --name github-runner-vm \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys

# Or use Windows
az vm create \
  --resource-group github-runner-rg \
  --name github-runner-vm \
  --image Win2022Datacenter \
  --size Standard_B2s \
  --admin-username azureuser \
  --admin-password <strong-password>
```

## Step 2: Install Prerequisites on VM

### For Linux:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install Git
sudo apt install git -y

# Install zip (for deployment packages)
sudo apt install zip -y

# Verify installations
node --version  # Should be v20.x.x
npm --version
az --version
git --version
```

### For Windows:
```powershell
# Install Node.js 20 from https://nodejs.org/
# Install Azure CLI from https://aka.ms/installazurecliwindows
# Install Git from https://git-scm.com/download/win

# Verify installations
node --version
npm --version
az --version
git --version
```

## Step 3: Add Runner to GitHub Repository

1. Go to: `https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners`

2. Click **"New self-hosted runner"**

3. Select your operating system (Linux/Windows/macOS)

4. Follow the instructions shown:

### For Linux:
```bash
# Create a folder
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner (use the token from GitHub)
./config.sh --url https://github.com/cloudsecurityweb/echopad-website --token <YOUR_TOKEN>

# When prompted:
# - Enter runner name: echopad-prod-runner (or any name)
# - Enter runner group: press Enter (default)
# - Enter labels: press Enter (default) or add "self-hosted"
# - Enter work folder: press Enter (default: _work)

# Run the runner
./run.sh
```

### For Windows:
```powershell
# Create a folder
mkdir actions-runner; cd actions-runner

# Download the latest runner package
Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-win-x64-2.311.0.zip -OutFile actions-runner-win-x64-2.311.0.zip

# Extract the installer
Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD\actions-runner-win-x64-2.311.0.zip", "$PWD")

# Configure the runner (use the token from GitHub)
.\config.cmd --url https://github.com/cloudsecurityweb/echopad-website --token <YOUR_TOKEN>

# When prompted:
# - Enter runner name: echopad-prod-runner
# - Enter runner group: press Enter
# - Enter labels: press Enter or add "self-hosted"
# - Enter work folder: press Enter

# Run the runner
.\run.cmd
```

## Step 4: Configure Runner as a Service (Optional but Recommended)

### For Linux:
```bash
# Install as a service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status

# Stop the service
sudo ./svc.sh stop

# Uninstall service
sudo ./svc.sh uninstall
```

### For Windows:
```powershell
# Install as a service
.\svc.cmd install

# Start the service
.\svc.cmd start

# Check status
.\svc.cmd status

# Stop the service
.\svc.cmd stop
```

## Step 5: Verify Runner

1. Go to: `https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners`
2. You should see your runner listed as "Online" (green dot)
3. The runner should show as "Idle" when not running jobs

## Step 6: Test the Runner

1. Go to: `https://github.com/cloudsecurityweb/echopad-website/actions`
2. Select any workflow
3. Click "Run workflow"
4. Select "Production" branch
5. Click "Run workflow"
6. The job should appear in the runner's queue and execute

## Troubleshooting

### Runner not appearing online
- Check if `run.sh` (Linux) or `run.cmd` (Windows) is running
- Check network connectivity
- Verify the token is correct
- Check firewall settings

### Jobs not running
- Ensure runner is online
- Check runner logs: `_diag/Runner_*.log`
- Verify Node.js and Azure CLI are installed
- Check disk space

### Permission issues
- Ensure runner user has permissions to:
  - Write to the work directory
  - Execute npm and az commands
  - Access network resources

## Security Best Practices

1. **Use a dedicated VM** for the runner (not shared with other services)
2. **Keep the runner updated**: Regularly update the runner software
3. **Limit access**: Only allow necessary network access
4. **Monitor logs**: Regularly check runner logs for issues
5. **Use service account**: Run the service as a non-privileged user

## Runner Maintenance

### Update Runner
```bash
# Stop the service
sudo ./svc.sh stop

# Download latest version
# Extract and configure again with new token

# Start the service
sudo ./svc.sh start
```

### View Logs
```bash
# Linux
tail -f _diag/Runner_*.log

# Windows
# Check Event Viewer or log files in _diag folder
```

## Next Steps

Once the runner is set up:
1. Add all GitHub Secrets (see `GITHUB_SECRETS_SETUP.md`)
2. Push code to `Production` branch
3. Workflows will automatically trigger
4. Monitor deployments in GitHub Actions tab
