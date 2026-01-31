# Fix /home Directory Full Issue

## Problem
`/home` is 100% full (1014M used, only 20K available). Runner can't write logs.

## Immediate Cleanup

### Step 1: Check What's Using Space
```bash
du -sh /home/sandeepd/* | sort -h
```

### Step 2: Clean Up Old Runner Logs
```bash
# Remove old diagnostic logs
rm -rf /home/sandeepd/actions-runner/_diag/*.log 2>/dev/null

# Remove old work directories
rm -rf /home/sandeepd/actions-runner/_work/* 2>/dev/null

# Or keep only recent (last 3 days)
find /home/sandeepd/actions-runner/_diag -name "*.log" -mtime +3 -delete 2>/dev/null
find /home/sandeepd/actions-runner/_work -type d -mtime +3 -exec rm -rf {} + 2>/dev/null
```

### Step 3: Find Large Files
```bash
find /home/sandeepd -type f -size +50M 2>/dev/null
find /home/sandeepd -type f -size +100M 2>/dev/null
```

### Step 4: Check Runner Location
```bash
# Check if runner exists in /home
ls -la /home/sandeepd/actions-runner 2>/dev/null

# Check if runner exists in /opt
ls -la /opt/actions-runner 2>/dev/null

# Check which one the service is using
sudo systemctl status actions.runner.* | grep ExecStart
```

### Step 5: Clean Up Other Common Large Files
```bash
# Clean npm cache (if exists)
rm -rf /home/sandeepd/.npm 2>/dev/null

# Clean pip cache (if exists)
rm -rf /home/sandeepd/.cache/pip 2>/dev/null

# Clean old downloads
rm -rf /home/sandeepd/Downloads/* 2>/dev/null

# Clean old archives
find /home/sandeepd -name "*.tar.gz" -mtime +30 -delete 2>/dev/null
find /home/sandeepd -name "*.zip" -mtime +30 -delete 2>/dev/null
```

## If Runner is in /home, Move to /opt

Since `/opt` likely has more space, move the runner:

```bash
# 1. Stop service
sudo systemctl stop actions.runner.*
cd /home/sandeepd/actions-runner
sudo ./svc.sh uninstall

# 2. Move runner to /opt
sudo mv /home/sandeepd/actions-runner /opt/actions-runner
sudo chown -R sandeepd:sandeepd /opt/actions-runner

# 3. Reinstall service
cd /opt/actions-runner
sudo ./svc.sh install
sudo ./svc.sh start
```

## Quick Cleanup Script

Run this to free up space quickly:

```bash
# Clean runner logs and work
rm -rf /home/sandeepd/actions-runner/_diag/*.log 2>/dev/null
rm -rf /home/sandeepd/actions-runner/_work/* 2>/dev/null

# Clean old files
find /home/sandeepd -type f -name "*.log" -mtime +7 -delete 2>/dev/null
find /home/sandeepd -type f -name "*.tmp" -mtime +1 -delete 2>/dev/null

# Check space freed
df -h /home
```

## Verify Space is Freed
```bash
df -h /home
```

Should show more than 20K available.

## Restart Runner
```bash
sudo systemctl restart actions.runner.*
sudo systemctl status actions.runner.*
```

## Prevent Future Issues

### Set Up Automatic Cleanup
```bash
# Edit crontab
crontab -e

# Add daily cleanup (runs at 2 AM)
0 2 * * * find /home/sandeepd/actions-runner/_diag -name "*.log" -mtime +3 -delete 2>/dev/null
0 2 * * * find /home/sandeepd/actions-runner/_work -type d -mtime +3 -exec rm -rf {} + 2>/dev/null
```

### Monitor Disk Space
```bash
# Check regularly
df -h /home
```
