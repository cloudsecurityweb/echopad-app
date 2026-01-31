# Fix Runner Session Conflict

## Problem
Error: `A session for this runner already exists` and `Runner connect error: Error: Conflict`

This happens when there are duplicate runner sessions or stale connections.

## Solution

### Step 1: Stop the Service
```bash
sudo systemctl stop actions.runner.*
```

### Step 2: Remove Stale Configuration
```bash
cd /opt/actions-runner
./config.sh remove
```

### Step 3: Get New Token from GitHub
1. Go to: https://github.com/cloudsecurityweb/echopad-app/settings/actions/runners
2. Click "New self-hosted runner"
3. Select Linux and ARM64
4. Copy the configuration token

### Step 4: Reconfigure Runner
```bash
cd /opt/actions-runner
./config.sh --url https://github.com/cloudsecurityweb/echopad-app --token <NEW_TOKEN> --name github-runner --replace
```

**Important:** Use `--replace` flag to replace any existing configuration.

### Step 5: Restart Service
```bash
sudo systemctl restart actions.runner.*
sudo systemctl status actions.runner.*
```

### Step 6: Verify Connection
```bash
sudo journalctl -u actions.runner.* -f
```

Look for:
- ✅ "Connected to GitHub"
- ✅ "Listening for Jobs"
- ❌ No "Conflict" errors

## Alternative: Clean Reinstall

If the above doesn't work:

```bash
# Stop and uninstall service
sudo systemctl stop actions.runner.*
sudo systemctl disable actions.runner.*
cd /opt/actions-runner
sudo ./svc.sh uninstall

# Remove configuration
./config.sh remove

# Get new token from GitHub
# Then reconfigure:
./config.sh --url https://github.com/cloudsecurityweb/echopad-app --token <NEW_TOKEN> --name github-runner

# Reinstall service
sudo ./svc.sh install
sudo ./svc.sh start
sudo systemctl status actions.runner.*
```

## Verify Fix

After reconfiguring, trigger a test workflow:
1. Go to: https://github.com/cloudsecurityweb/echopad-app/actions
2. Click "Test Runner" workflow
3. Click "Run workflow"
4. Check if it completes successfully

If jobs still fail, check logs:
```bash
sudo journalctl -u actions.runner.* -f
cd /opt/actions-runner/_diag
tail -f Runner_*.log
```
