# Service Principal Permissions Fix

## Issue: "No subscriptions found"

This error occurs when the service principal doesn't have the necessary role assignments on the subscription.

## Solution: Assign Contributor Role

The service principal needs the **Contributor** role on both DEV and PROD subscriptions.

### Commands to Fix

```bash
# For DEV subscription
az account set --subscription "c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2"
az role assignment create \
  --assignee d4ea5537-8b2a-4b88-9dbd-80bf02596c1a \
  --role "Contributor" \
  --scope /subscriptions/c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2

# For PROD subscription
az account set --subscription "c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb"
az role assignment create \
  --assignee d4ea5537-8b2a-4b88-9dbd-80bf02596c1a \
  --role "Contributor" \
  --scope /subscriptions/c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb
```

### Verify Permissions

```bash
# Check DEV subscription
az role assignment list \
  --assignee d4ea5537-8b2a-4b88-9dbd-80bf02596c1a \
  --scope /subscriptions/c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2

# Check PROD subscription
az role assignment list \
  --assignee d4ea5537-8b2a-4b88-9dbd-80bf02596c1a \
  --scope /subscriptions/c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb
```

## Required Permissions

The service principal needs:
- **Contributor** role on the subscription (for deploying resources)
- Access to both DEV and PROD subscriptions

## After Fixing

1. Re-run the GitHub Actions workflow
2. The Azure login should now succeed
3. Deployment should proceed normally
