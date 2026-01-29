# Fix Error 217/USER - User Not Found

Error 217/USER means systemd cannot find the user specified in the service file.

## Quick Fix Options

### Option 1: Check and Fix Username

```bash
# Check your actual username
whoami

# Check what's in the service file
sudo grep "^User=" /etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

# Update to match your actual username
sudo sed -i 's/^User=.*/User=sandeepd/' /etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl start actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service
```

### Option 2: Check if User Exists

```bash
# Check if user exists
id sandeepd

# If user doesn't exist, check what users are available
getent passwd | grep -E "(sandeepd|azureuser)"

# List all users
getent passwd | cut -d: -f1
```

### Option 3: Use Root (Not Recommended, but Works)

If the user doesn't exist or can't be found:

```bash
# Edit service file to use root
sudo sed -i 's/^User=.*/User=root/' /etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl start actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service
```

**Note**: Running as root is less secure but will work if user issues persist.

### Option 4: Reinstall Service (Recommended)

The cleanest solution is to reinstall the service:

```bash
cd ~/actions-runner

# Uninstall
sudo ./svc.sh uninstall

# Make sure you're logged in as the correct user
whoami  # Should show: sandeepd (or your username)

# Reinstall (this will detect the correct user)
./svc.sh install  # Without sudo - installs as current user

# Start
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

## Check Service File

View the full service file:

```bash
sudo cat /etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service
```

Look for:
- `User=` - should match your actual username
- `Group=` - should match your group
- `WorkingDirectory=` - should point to `~/actions-runner`

## Verify User

```bash
# Check current user
whoami

# Check user ID
id

# Check if user can access runner directory
ls -la ~/actions-runner
```

## Complete Reinstall Steps

If nothing works, complete reinstall:

```bash
cd ~/actions-runner

# Stop service
sudo systemctl stop actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service 2>/dev/null || true

# Uninstall
sudo ./svc.sh uninstall

# Remove service file
sudo rm -f /etc/systemd/system/actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service

# Reload systemd
sudo systemctl daemon-reload

# Reinstall as current user (important: no sudo)
./svc.sh install

# Start service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

## Alternative: Run Manually

If service keeps failing, you can run manually:

```bash
cd ~/actions-runner
./run.sh
```

This runs in foreground. For production, you'd want to use a process manager or screen/tmux.

## Check Logs

```bash
# Service logs
sudo journalctl -u actions.runner.cloudsecurityweb-echopad-website.echopad-prod-runner.service -n 50 --no-pager

# Runner logs
tail -f ~/actions-runner/_diag/Runner_*.log
```
