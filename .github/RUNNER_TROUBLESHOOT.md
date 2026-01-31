# GitHub Actions Runner Troubleshooting

## Network Connectivity ✅
Network tests passed:
- ✅ GitHub.com reachable
- ✅ vstoken.actions.githubusercontent.com reachable  
- ✅ DNS resolution working
- ✅ No proxy needed

## Current Issue
`SocketException (125): Operation canceled` - Connection being canceled after establishment.

## Diagnostic Steps

### 1. Check Runner Version
```bash
cd /opt/actions-runner
./run.sh --version
```

### 2. Update Runner
```bash
cd /opt/actions-runner
./run.sh --update
sudo systemctl restart actions.runner.*
```

### 3. Check Runner Configuration
```bash
cd /opt/actions-runner
cat .runner
```

### 4. Check Service User and Permissions
```bash
# Check service user
sudo systemctl show actions.runner.* | grep User

# Check _work directory permissions
ls -la /opt/actions-runner/_work
touch /opt/actions-runner/_work/test.txt && rm /opt/actions-runner/_work/test.txt

# If permission issues, fix:
sudo chown -R runner-user:runner-group /opt/actions-runner/_work
```

### 5. Check Runner Logs in Real-Time
```bash
# Watch for connection issues
sudo journalctl -u actions.runner.* -f | grep -i "error\|exception\|cancel"

# Check diagnostic logs
cd /opt/actions-runner/_diag
tail -f Runner_*.log | grep -i "error\|exception\|cancel"
```

### 6. Test Runner Manually (Not as Service)
```bash
# Stop service
sudo systemctl stop actions.runner.*

# Run manually to see detailed output
cd /opt/actions-runner
./run.sh

# Watch for errors in real-time
```

### 7. Reconfigure Runner (If Needed)
```bash
cd /opt/actions-runner
sudo ./svc.sh stop
sudo ./svc.sh uninstall
./config.sh remove

# Get new token from GitHub:
# Settings > Actions > Runners > New self-hosted runner

./config.sh --url https://github.com/cloudsecurityweb/echopad-app --token <NEW_TOKEN> --name github-runner
sudo ./svc.sh install
sudo ./svc.sh start
```

### 8. Check System Resources
```bash
# Check memory
free -h

# Check disk space
df -h

# Check if system is overloaded
top
```

### 9. Check for ARM64 Compatibility Issues
```bash
# Verify architecture
uname -m
# Should show: aarch64

# Check if runner binary is correct architecture
file /opt/actions-runner/bin/Runner.Listener
# Should show: ARM64 or aarch64
```

### 10. Check Time Synchronization
```bash
# Check system time
date

# If time is wrong, sync:
sudo chrony sources -v
# or
sudo ntpdate -s time.nist.gov
```

## Common Solutions

### If runner version is old:
```bash
cd /opt/actions-runner
./run.sh --update
sudo systemctl restart actions.runner.*
```

### If permissions issue:
```bash
sudo chown -R $(whoami):$(whoami) /opt/actions-runner/_work
```

### If service user mismatch:
```bash
# Check current user
whoami

# Reinstall service with correct user
cd /opt/actions-runner
sudo ./svc.sh stop
sudo ./svc.sh uninstall
sudo ./svc.sh install
sudo ./svc.sh start
```

### If connection keeps timing out:
- Check Azure NSG rules (if VM is in Azure)
- Check if there are rate limits
- Try increasing timeout in runner config

## Next Steps

1. Run diagnostic steps above
2. Check runner logs for specific error messages
3. Try running runner manually (not as service) to see detailed output
4. If still failing, reconfigure runner with fresh token
