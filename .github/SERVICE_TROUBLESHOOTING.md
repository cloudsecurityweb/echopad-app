# GitHub Actions Runner Service Troubleshooting

## Error: exit-code 203/EXEC

This error means systemd cannot execute the service script. Common causes:

1. **Missing execute permissions**
2. **Incorrect path in service file**
3. **Missing shebang in script**
4. **Wrong user/group permissions**

## Quick Fix

Run these commands on your RHEL server:

```bash
cd ~/actions-runner

# Fix permissions
chmod +x runsvc.sh
chmod +x run.sh
chmod +x config.sh
chmod +x bin/Runner.Listener
chmod +x bin/Runner.Worker

# Reinstall service
sudo ./svc.sh uninstall
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

## Detailed Fix Steps

### Step 1: Check Permissions

```bash
cd ~/actions-runner
ls -la runsvc.sh
ls -la bin/Runner.Listener
```

Should show `-rwxr-xr-x` (executable). If not, fix:

```bash
chmod +x runsvc.sh
chmod +x run.sh
chmod +x config.sh
chmod +x bin/Runner.Listener
chmod +x bin/Runner.Worker
```

### Step 2: Check Service File

```bash
sudo cat /etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service
```

Should show:
```
ExecStart=/home/sandeepd/actions-runner/runsvc.sh
```

If the path is wrong, reinstall the service.

### Step 3: Check runsvc.sh

```bash
head -1 ~/actions-runner/runsvc.sh
```

Should show: `#!/bin/bash` or similar.

### Step 4: Reinstall Service

```bash
cd ~/actions-runner

# Stop and remove old service
sudo systemctl stop actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service
sudo systemctl disable actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

# Uninstall
sudo ./svc.sh uninstall

# Reinstall
sudo ./svc.sh install

# Start
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

### Step 5: Check Logs

If still failing, check logs:

```bash
# Service logs
sudo journalctl -u actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service -n 50 --no-pager

# Runner logs
tail -f ~/actions-runner/_diag/Runner_*.log
```

## Alternative: Run Manually (Temporary)

If service keeps failing, run manually for testing:

```bash
cd ~/actions-runner
./run.sh
```

This will run in foreground. Press Ctrl+C to stop.

## Check Service File Details

```bash
sudo systemctl cat actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service
```

Look for:
- Correct `ExecStart` path
- Correct `User` (should be your username: `sandeepd`)
- Correct `WorkingDirectory`

## Common Issues

### Issue 1: Wrong User

Service might be trying to run as wrong user. Check:

```bash
whoami  # Should be: sandeepd
```

Service should run as this user. If installed as root, reinstall:

```bash
cd ~/actions-runner
sudo ./svc.sh uninstall
./svc.sh install  # Without sudo (runs as current user)
sudo ./svc.sh start
```

### Issue 2: Path Issues

If your home directory path has spaces or special characters, the service might fail. Check:

```bash
echo $HOME
```

### Issue 3: SELinux

If SELinux is enabled, it might block execution:

```bash
# Check SELinux status
getenforce

# If Enforcing, try permissive mode (temporary)
sudo setenforce 0

# Then restart service
sudo ./svc.sh restart
```

## Verify Service is Working

After fixing, verify:

```bash
# Check service status
sudo systemctl status actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

# Check if runner process is running
ps aux | grep Runner.Listener

# Check GitHub - runner should be online
# https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners
```

## Complete Reinstall

If nothing works, complete reinstall:

```bash
# Stop service
sudo systemctl stop actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service
sudo systemctl disable actions.runner.cloudsecurityweb-echopad-website.echopad-website.echopad-prod-runner.service

# Uninstall
cd ~/actions-runner
sudo ./svc.sh uninstall

# Remove service file
sudo rm -f /etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

# Reinstall
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```
