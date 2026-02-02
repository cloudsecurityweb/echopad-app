# Azure Credentials Fix Guide

## Error: Invalid Client Secret

**Error Message:**
```
AADSTS7000215: Invalid client secret provided. Ensure the secret being sent in the request 
is the client secret value, not the client secret ID, for a secret added to app '***'.
```

## Problem

The `PROD_AZURE_CREDS` or `DEV_AZURE_CREDS` secret contains:
- ❌ Client Secret ID (instead of the actual secret value)
- ❌ Expired client secret
- ❌ Incorrect JSON format

## Solution

### Step 1: Get the Correct Client Secret Value

The secret must be the **actual secret value**, not the secret ID. When you create a secret in Azure, you only see the value once - you need to copy it immediately.

**If you don't have the secret value:**

1. **Create a new client secret:**
   ```bash
   # Login to Azure
   az login
   
   # Get your app registration details
   az ad app list --display-name "Your-App-Name" --query "[].{id:appId}" -o tsv
   
   # Create a new secret (you'll see the value only once!)
   az ad app credential reset --id <APP_ID> --append
   ```
   
   **IMPORTANT:** Copy the `password` value immediately - you won't see it again!

2. **Or use Azure Portal:**
   - Go to Azure Portal → Azure Active Directory → App registrations
   - Find your app registration
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Copy the **Value** (not the Secret ID!)
   - Set expiration (recommended: 24 months)

### Step 2: Format the Secret Correctly

The `PROD_AZURE_CREDS` secret must be a JSON string with this exact format:

```json
{
  "clientId": "your-client-id-here",
  "clientSecret": "your-secret-value-here",
  "tenantId": "your-tenant-id-here",
  "subscriptionId": "your-subscription-id-here"
}
```

**Example:**
```json
{
  "clientId": "d4ea5537-8b2a-4b88-9dbd-80bf02596c1a",
  "clientSecret": "abc123~SecretValue-NotSecretId",
  "tenantId": "12345678-1234-1234-1234-123456789012",
  "subscriptionId": "c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2"
}
```

### Step 3: Update GitHub Secret

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Find `PROD_AZURE_CREDS` (or `DEV_AZURE_CREDS`)
3. Click "Update"
4. Paste the **entire JSON** as a single line (or multi-line, both work)
5. Click "Update secret"

**Important Notes:**
- The `clientSecret` must be the **actual secret value**, not the Secret ID
- The JSON must be valid (no trailing commas, proper quotes)
- All fields are required: `clientId`, `clientSecret`, `tenantId`, `subscriptionId`

### Step 4: Verify the Secret Format

You can test the secret format locally:

```bash
# Create a test file (don't commit this!)
cat > test-creds.json << 'EOF'
{
  "clientId": "your-client-id",
  "clientSecret": "your-secret-value",
  "tenantId": "your-tenant-id",
  "subscriptionId": "your-subscription-id"
}
EOF

# Test login
az login --service-principal \
  --username "$(jq -r '.clientId' test-creds.json)" \
  --password "$(jq -r '.clientSecret' test-creds.json)" \
  --tenant "$(jq -r '.tenantId' test-creds.json)"

# If successful, the secret format is correct
# Clean up
rm test-creds.json
```

### Step 5: Alternative - Use Individual Secrets

If you prefer, you can use individual secrets instead of a JSON:

**In workflow:**
```yaml
- name: Azure Login
  uses: azure/login@v2
  with:
    creds: |
      {
        "clientId": "${{ secrets.PROD_AZURE_CLIENT_ID }}",
        "clientSecret": "${{ secrets.PROD_AZURE_CLIENT_SECRET }}",
        "tenantId": "${{ secrets.PROD_AZURE_TENANT_ID }}",
        "subscriptionId": "${{ secrets.PROD_AZURE_SUBSCRIPTION_ID }}"
      }
```

**Then create these secrets:**
- `PROD_AZURE_CLIENT_ID`
- `PROD_AZURE_CLIENT_SECRET` (the actual secret value!)
- `PROD_AZURE_TENANT_ID`
- `PROD_AZURE_SUBSCRIPTION_ID`

## Common Mistakes

1. **Using Secret ID instead of Secret Value:**
   - ❌ Secret ID: `abc12345-6789-0123-4567-890123456789`
   - ✅ Secret Value: `abc123~SecretValue-NotSecretId`

2. **Expired Secret:**
   - Check expiration date in Azure Portal
   - Create a new secret if expired

3. **Wrong App Registration:**
   - Ensure you're using the correct app registration
   - Verify the client ID matches

4. **JSON Format Errors:**
   - Missing quotes around values
   - Trailing commas
   - Missing fields

## Verification

After updating the secret, trigger a workflow and check:
- ✅ Azure login succeeds
- ✅ No "Invalid client secret" errors
- ✅ Deployment proceeds normally

## Prevention

1. **Document secret expiration dates**
2. **Set up secret rotation schedule**
3. **Use Azure Key Vault for production** (more secure)
4. **Monitor secret expiration** in Azure Portal
