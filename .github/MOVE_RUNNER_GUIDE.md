# 🔄 Move GitHub Actions Runner to echopad-app

## Quick Steps

1. **Get registration token:**
   - Go to: https://github.com/cloudsecurityweb/echopad-app/settings/actions/runners/new
   - Copy the registration token

2. **SSH into runner VM:**
   ```bash
   ssh sandeepd@<runner-vm-ip>
   cd ~/actions-runner
   ```

3. **Stop and reconfigure:**
   ```bash
   sudo ./svc.sh stop
   ./config.sh remove --token <old-remove-token>
   ./config.sh --url https://github.com/cloudsecurityweb/echopad-app --token <new-token> --name echopad-prod-runner --replace
   sudo ./svc.sh install
   sudo ./svc.sh start
   ```

4. **Verify:**
   - https://github.com/cloudsecurityweb/echopad-app/settings/actions/runners
   - Runner should show as "Online"
