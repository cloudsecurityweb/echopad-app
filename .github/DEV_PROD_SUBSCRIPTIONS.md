# DEV and PROD Subscription Setup

## Current Status

I created credentials using subscription: **csw-echopad-nonprod** (ID: `c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2`)

## Required Setup

We need **separate credentials** for DEV and PROD environments:

### DEV Environment (develop branch)
- **Subscription:** `csw-echopad-nonprod` (or confirm the DEV subscription)
- **Subscription ID:** `c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2`
- **GitHub Secret:** `DEV_AZURE_CREDS`
- **Service Principal:** (Need to create or use existing DEV SP)

### PROD Environment (main branch)
- **Subscription:** (Need PROD subscription name/ID)
- **Subscription ID:** (Need PROD subscription ID)
- **GitHub Secret:** `PROD_AZURE_CREDS`
- **Service Principal:** (Need to create or use existing PROD SP)

## Next Steps

1. **Confirm DEV subscription:**
   - Is `csw-echopad-nonprod` the DEV subscription?
   - Or is there a different DEV subscription?

2. **Get PROD subscription details:**
   - What is the PROD subscription name?
   - What is the PROD subscription ID?

3. **Create/Get Service Principals:**
   - DEV Service Principal (for develop branch)
   - PROD Service Principal (for main branch)

4. **Create GitHub Secrets:**
   - `DEV_AZURE_CREDS` - JSON with DEV credentials
   - `PROD_AZURE_CREDS` - JSON with PROD credentials

## Commands to Get Subscription Info

```bash
# List all subscriptions
az account list --query "[].{name:name, id:id}" -o table

# Get current subscription
az account show

# Switch to a subscription
az account set --subscription "SUBSCRIPTION_ID"
```

## Commands to Create Service Principals

### For DEV:
```bash
# Switch to DEV subscription
az account set --subscription "DEV_SUBSCRIPTION_ID"

# Create or get service principal
az ad sp create-for-rbac --name "echopad-dev-sp" --role contributor --scopes /subscriptions/DEV_SUBSCRIPTION_ID
```

### For PROD:
```bash
# Switch to PROD subscription
az account set --subscription "PROD_SUBSCRIPTION_ID"

# Create or get service principal
az ad sp create-for-rbac --name "echopad-prod-sp" --role contributor --scopes /subscriptions/PROD_SUBSCRIPTION_ID
```

## Format for GitHub Secrets

### DEV_AZURE_CREDS:
```json
{
  "clientId": "DEV_CLIENT_ID",
  "clientSecret": "DEV_CLIENT_SECRET",
  "tenantId": "TENANT_ID",
  "subscriptionId": "DEV_SUBSCRIPTION_ID"
}
```

### PROD_AZURE_CREDS:
```json
{
  "clientId": "PROD_CLIENT_ID",
  "clientSecret": "PROD_CLIENT_SECRET",
  "tenantId": "TENANT_ID",
  "subscriptionId": "PROD_SUBSCRIPTION_ID"
}
```
