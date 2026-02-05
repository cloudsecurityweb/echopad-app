# Runner Tools and Disk Space Fix

## Critical Issues Found

1. **Azure CLI not found**: `az` command is not in PATH
2. **Disk space critical**: Only 9 MB free - runner will fail soon

## Fix Steps (Run on Runner Server)

### Step 1: Check Current Disk Usage

```bash
# Check disk usage
df -h

# Check what's using space
du -sh /opt/actions-runner/_work/* 2>/dev/null
du -sh /opt/actions-runner/_diag/* 2>/dev/null
du -sh /home/* 2>/dev/null
```

### Step 2: Clean Up Disk Space

```bash
# Stop the runner service first
sudo systemctl stop actions.runner.*

# Clean old work directories (older than 7 days)
find /opt/actions-runner/_work -type d -mtime +7 -exec rm -rf {} + 2>/dev/null

# Clean old diagnostic logs (older than 3 days)
find /opt/actions-runner/_diag -name "*.log" -mtime +3 -delete 2>/dev/null

# Clean npm cache
rm -rf /home/github-runner/.npm 2>/dev/null
rm -rf /root/.npm 2>/dev/null

# Clean temporary files
rm -rf /tmp/* 2>/dev/null
rm -rf /var/tmp/* 2>/dev/null

# Clean old archives and downloads
find /opt/actions-runner -name "*.tar.gz" -mtime +7 -delete 2>/dev/null
find /opt/actions-runner -name "*.zip" -mtime +7 -delete 2>/dev/null

# Check disk space again
df -h
```

### Step 3: Install/Verify Azure CLI

```bash
# Check if Azure CLI is installed
which az
az --version 2>&1 || echo "Azure CLI not found"

# If not found, install Azure CLI
# For RHEL/CentOS/Rocky Linux (ARM64):
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# OR for RHEL/CentOS/Rocky Linux (alternative):
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[azure-cli]
name=Azure CLI
baseurl=https://packages.microsoft.com/yumrepos/azure-cli
enabled=1
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/azure-cli.repo'
sudo yum install -y azure-cli

# Verify installation
az --version
```

### Step 4: Add Tools to PATH for Runner User

The runner runs as `github-runner` user. We need to ensure tools are in PATH:

```bash
# Check current PATH for runner user
sudo -u github-runner echo $PATH

# Find where tools are installed
which git || find /usr -name git 2>/dev/null | head -1
which node || find /opt -name node 2>/dev/null | head -1
which npm || find /opt -name npm 2>/dev/null | head -1
which az || find /usr -name az 2>/dev/null | head -1

# Add to runner's .bashrc or .profile
sudo -u github-runner bash -c 'cat >> ~/.bashrc << EOF

# GitHub Actions Runner PATH
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:\$PATH"
export PATH="/opt/actions-runner/externals/node20/bin:\$PATH"
export PATH="/usr/local/bin/azure-cli:\$PATH"
EOF'

# Or create a system-wide profile for runner user
sudo tee /etc/profile.d/github-runner-path.sh << 'EOF'
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
export PATH="/opt/actions-runner/externals/node20/bin:$PATH"
EOF

# Make it executable
sudo chmod +x /etc/profile.d/github-runner-path.sh
```

### Step 5: Configure Runner Environment Variables

Edit the runner's environment file:

```bash
# Edit runner's environment (if using systemd service)
sudo systemctl edit actions.runner.cloudsecurityweb-echopad-app.github-runner.service

# Add this in the [Service] section:
[Service]
Environment="PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/actions-runner/externals/node20/bin"
```

OR create a `.env` file in the runner directory:

```bash
cd /opt/actions-runner
sudo tee .env << 'EOF'
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/actions-runner/externals/node20/bin
EOF
```

### Step 6: Verify Tools Are Accessible

```bash
# Test as runner user
sudo -u github-runner bash -c 'git --version'
sudo -u github-runner bash -c 'node --version'
sudo -u github-runner bash -c 'npm --version'
sudo -u github-runner bash -c 'az --version'
```

### Step 7: Restart Runner Service

```bash
# Restart the runner service
sudo systemctl restart actions.runner.*

# Check status
sudo systemctl status actions.runner.*

# Check logs
sudo journalctl -u actions.runner.* -f
```

## Alternative: Use Full Paths in Workflow

If you can't modify PATH, you can update the workflow to use full paths:

```yaml
- name: Azure Login
  uses: azure/login@v2
  with:
    creds: ${{ secrets.PROD_AZURE_CREDS }}
    # Add this if az is in a specific location
    # az-path: /usr/local/bin/az
```

## Verify Fix

After applying fixes, trigger a test workflow and check:
1. ✅ Azure CLI is found
2. ✅ Disk space is above 1 GB free
3. ✅ All tools are accessible

## Prevention

1. **Set up automatic cleanup** in a cron job:
```bash
# Add to crontab (run daily at 2 AM)
0 2 * * * find /opt/actions-runner/_work -type d -mtime +7 -exec rm -rf {} + 2>/dev/null
0 2 * * * find /opt/actions-runner/_diag -name "*.log" -mtime +3 -delete 2>/dev/null
```

2. **Monitor disk space**:
```bash
# Add disk space check script
cat > /usr/local/bin/check-disk-space.sh << 'EOF'
#!/bin/bash
THRESHOLD=1000  # MB
FREE=$(df -m / | awk 'NR==2 {print $4}')
if [ $FREE -lt $THRESHOLD ]; then
  echo "WARNING: Low disk space: ${FREE}MB free"
  # Send alert or trigger cleanup
fi
EOF
chmod +x /usr/local/bin/check-disk-space.sh
```
