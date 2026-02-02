# Fix Runner Disk Space Issue

## Problem
Error: `System.IO.IOException: No space left on device`

The runner can't write logs or execute jobs because the disk is full.

## Quick Fix Steps

### 1. Check Disk Space
```bash
df -h
```

### 2. Find What's Using Space
```bash
# Check home directory
du -sh /home/sandeepd/* | sort -h

# Check runner directories
du -sh /home/sandeepd/actions-runner/* 2>/dev/null
du -sh /opt/actions-runner/* 2>/dev/null

# Find large files
find /home/sandeepd -type f -size +100M 2>/dev/null
find /opt -type f -size +100M 2>/dev/null
```

### 3. Clean Up Old Runner Logs
```bash
# Remove old diagnostic logs
rm -rf /home/sandeepd/actions-runner/_diag/*.log
rm -rf /opt/actions-runner/_diag/*.log

# Keep only recent logs (last 7 days)
find /home/sandeepd/actions-runner/_diag -name "*.log" -mtime +7 -delete
find /opt/actions-runner/_diag -name "*.log" -mtime +7 -delete
```

### 4. Clean Up Old Work Directories
```bash
# Remove old job work directories
rm -rf /home/sandeepd/actions-runner/_work/*
rm -rf /opt/actions-runner/_work/*

# Or keep only recent (last 3 days)
find /home/sandeepd/actions-runner/_work -type d -mtime +3 -exec rm -rf {} + 2>/dev/null
find /opt/actions-runner/_work -type d -mtime +3 -exec rm -rf {} + 2>/dev/null
```

### 5. Clean System Logs
```bash
# Clean journal logs (keep last 7 days)
sudo journalctl --vacuum-time=7d

# Or limit to specific size
sudo journalctl --vacuum-size=500M
```

### 6. Clean Package Cache
```bash
# Clean yum/dnf cache
sudo yum clean all
# or
sudo dnf clean all

# Clean npm cache (if exists)
npm cache clean --force
```

### 7. Remove Old Docker Images/Containers (if Docker is installed)
```bash
docker system prune -a --volumes
```

### 8. Check for Duplicate Runner Installations
```bash
# You might have runner in both /home and /opt
ls -la /home/sandeepd/actions-runner
ls -la /opt/actions-runner

# If both exist, remove the one not being used
# (Check which one the service is using)
sudo systemctl status actions.runner.* | grep ExecStart
```

## Verify Space is Freed
```bash
df -h
```

## Restart Runner After Cleanup
```bash
sudo systemctl restart actions.runner.*
sudo systemctl status actions.runner.*
```

## Prevent Future Issues

### Set Up Log Rotation
Create a cron job to clean old logs:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * find /opt/actions-runner/_diag -name "*.log" -mtime +7 -delete
0 2 * * * find /opt/actions-runner/_work -type d -mtime +3 -exec rm -rf {} + 2>/dev/null
```

### Monitor Disk Space
```bash
# Check disk usage regularly
df -h | grep -E 'Filesystem|/$|/home'
```

## If Still No Space

### Option 1: Expand Disk (if VM)
- If using Azure VM, expand the disk in Azure Portal
- Then extend filesystem: `sudo growpart /dev/sda1 1 && sudo resize2fs /dev/sda1`

### Option 2: Move Runner to Different Location
```bash
# Stop service
sudo systemctl stop actions.runner.*
sudo ./svc.sh uninstall

# Move to location with more space
sudo mv /opt/actions-runner /mnt/larger-disk/actions-runner

# Update service
cd /mnt/larger-disk/actions-runner
sudo ./svc.sh install
sudo ./svc.sh start
```

### Option 3: Add Additional Disk
- Attach new disk to VM
- Mount it
- Move runner or work directories there

## After Cleanup

1. Verify disk space: `df -h`
2. Restart runner: `sudo systemctl restart actions.runner.*`
3. Test workflow: Trigger a test job
4. Monitor logs: `sudo journalctl -u actions.runner.* -f`
