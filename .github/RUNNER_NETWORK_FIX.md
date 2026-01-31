# GitHub Actions Runner Network Connection Fix

## Problem
Runner is experiencing `SocketException (125): Operation canceled` errors when connecting to GitHub's broker server. Jobs fail immediately because the connection is lost before logs can be uploaded.

## Symptoms
- Jobs fail in 2-3 seconds
- No logs appear in GitHub Actions UI
- Runner logs show: `System.Net.Sockets.SocketException (125): Operation canceled`
- `BrokerServer` connection errors

## Root Cause
Network connectivity issues between the runner and GitHub's infrastructure.

## Fix Steps

### 1. Test Network Connectivity

```bash
# Test basic GitHub connectivity
curl -I https://github.com

# Test Actions broker connectivity
curl -I https://vstoken.actions.githubusercontent.com

# Test DNS resolution
nslookup github.com
nslookup vstoken.actions.githubusercontent.com
```

### 2. Check Proxy Settings

```bash
# Check if proxy environment variables are set
echo $HTTP_PROXY
echo $HTTPS_PROXY
echo $NO_PROXY

# If proxy is needed, configure runner
cd /opt/actions-runner
./config.sh --proxyurl http://proxy-server:port
```

### 3. Check Firewall Rules

Ensure outbound connections are allowed to:
- `*.github.com` (port 443)
- `*.actions.githubusercontent.com` (port 443)
- `*.githubusercontent.com` (port 443)

### 4. Check Runner Service Configuration

```bash
# Check runner service status
sudo systemctl status actions.runner.*

# Check runner logs for connection details
sudo journalctl -u actions.runner.* -f

# Restart runner service
sudo systemctl restart actions.runner.*
```

### 5. Verify Runner Configuration

```bash
cd /opt/actions-runner
cat .runner

# Check if runner URL and token are correct
# Reconfigure if needed:
./config.sh remove
./config.sh --url https://github.com/cloudsecurityweb/echopad-app --token <NEW_TOKEN>
```

### 6. Check System Resources

```bash
# Check if system is running out of resources
free -h
df -h
top
```

### 7. Update Runner

```bash
cd /opt/actions-runner
./run.sh --update
```

### 8. Test with Minimal Workflow

Use the `test-runner.yml` workflow to test if basic connectivity works:
1. Go to: https://github.com/cloudsecurityweb/echopad-app/actions
2. Click "Test Runner" workflow
3. Click "Run workflow"
4. Check if it completes successfully

## Common Solutions

### If behind corporate firewall:
- Configure proxy settings
- Add firewall exceptions
- Use VPN if needed

### If DNS issues:
- Update `/etc/resolv.conf` with reliable DNS servers
- Test DNS resolution

### If SSL/TLS issues:
- Update CA certificates: `sudo update-ca-certificates`
- Check system time is correct: `date`

### If timeout issues:
- Increase network timeout in runner config
- Check network latency: `ping github.com`

## Verification

After applying fixes, monitor runner logs:
```bash
sudo journalctl -u actions.runner.* -f
```

Look for:
- ✅ "Connected to GitHub"
- ✅ "Listening for Jobs"
- ✅ Successful job completions
- ❌ No more "Operation canceled" errors
