# GitHub Actions Runner Configuration Guide

## Runner Group Issue

When configuring the runner, if you see:
```
Could not find any self-hosted runner group named "xxx"
```

**Solution**: Just press **Enter** to use the **Default** runner group.

## Correct Configuration Steps

Run the configuration command:

```bash
cd ~/actions-runner
./config.sh --url https://github.com/cloudsecurityweb/echopad-website --token B4TQYSXNPSKYR4JAQNG4L43JPNIT2 --name echopad-prod-runner
```

When prompted:

1. **Enter the name of the runner group**: 
   - Just press **Enter** (use Default group)
   - OR if you want a custom group, create it first in GitHub (see below)

2. **Enter labels** (optional):
   - Press **Enter** for default labels
   - OR add custom labels like: `self-hosted,linux,rhel,arm64`

3. **Enter work folder**:
   - Press **Enter** for default (`_work`)

## Creating a Custom Runner Group (Optional)

If you want to create a custom runner group:

1. Go to: https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners
2. Click on **"Runner groups"** tab (if available)
3. Click **"New runner group"**
4. Enter name: `csw-actions-runner` (or any name)
5. Configure permissions
6. Then use this group name during configuration

**Note**: For most use cases, the **Default** group is sufficient.

## Complete Configuration Example

```bash
cd ~/actions-runner

./config.sh \
  --url https://github.com/cloudsecurityweb/echopad-website \
  --token B4TQYSXNPSKYR4JAQNG4L43JPNIT2 \
  --name echopad-prod-runner

# When prompted:
# Runner group: [Press Enter for Default]
# Labels: [Press Enter for default, or type: self-hosted,linux,rhel,arm64]
# Work folder: [Press Enter for _work]
```

## After Successful Configuration

1. **Install as service** (recommended):
   ```bash
   cd ~/actions-runner
   sudo ./svc.sh install
   sudo ./svc.sh start
   sudo ./svc.sh status
   ```

2. **Verify runner is online**:
   - Go to: https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners
   - You should see `echopad-prod-runner` listed as **"Online"** (green dot)

3. **Test the runner**:
   - Go to: https://github.com/cloudsecurityweb/echopad-website/actions
   - Trigger any workflow
   - The job should run on your self-hosted runner

## Troubleshooting

### Token Expired

If the token expires, get a new one:
1. Go to: https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners
2. Click **"New self-hosted runner"**
3. Copy the new token
4. Re-run configuration with new token

### Runner Not Appearing

1. Check runner is running:
   ```bash
   cd ~/actions-runner
   sudo ./svc.sh status
   ```

2. Check logs:
   ```bash
   tail -f ~/actions-runner/_diag/Runner_*.log
   ```

3. Restart service:
   ```bash
   sudo ./svc.sh restart
   ```
