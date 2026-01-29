# GitHub Secrets Setup Scripts

These scripts help you add GitHub secrets from the command line.

## Prerequisites

### Option 1: GitHub CLI (Recommended)

Install GitHub CLI:
```bash
# macOS
brew install gh

# Linux
# See: https://cli.github.com/manual/installation

# Windows
winget install GitHub.cli
```

Authenticate:
```bash
gh auth login
```

### Option 2: GitHub API (Alternative)

Requires:
- Python 3
- pynacl library: `pip3 install pynacl`
- GitHub Personal Access Token with `repo` permissions

Create token at: https://github.com/settings/tokens

Set environment variable:
```bash
export GITHUB_TOKEN=your_personal_access_token
```

## Scripts

### 1. Interactive Script (GitHub CLI)

**File**: `add-secrets-gh-cli.sh`

Interactive script that prompts for each secret value.

```bash
cd .github/scripts
./add-secrets-gh-cli.sh
```

Features:
- ✅ Interactive prompts
- ✅ Supports all environments (PROD, DEV, STAGING)
- ✅ Can add for all environments at once
- ✅ Checks if secrets already exist

### 2. From File Script (GitHub CLI)

**File**: `add-secrets-from-file.sh`

Adds secrets from a file (useful for bulk import).

**Create a secrets file** (e.g., `secrets-prod.txt`):
```
AZURE_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
AZURE_TENANT_ID=42619268-2056-407a-9f6c-72e6741615e5
AZURE_SUBSCRIPTION_ID=c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb
AZURE_RESOURCE_GROUP=echopad-prod-rg
AZURE_WEBAPP_NAME=echopad-prod-api
# ... etc
```

**Run the script**:
```bash
cd .github/scripts
./add-secrets-from-file.sh PROD secrets-prod.txt
```

### 3. API Method (Alternative)

**File**: `add-secrets-api.sh`

Uses GitHub API directly (requires pynacl for encryption).

```bash
export GITHUB_TOKEN=your_token
cd .github/scripts
./add-secrets-api.sh
```

## Quick Start

### Method 1: Install GitHub CLI and Use Interactive Script

```bash
# Install GitHub CLI
brew install gh  # macOS
# or see: https://cli.github.com/

# Authenticate
gh auth login

# Run script
cd /Users/sandeepdaddala/Desktop/CSW/echopad/.github/scripts
./add-secrets-gh-cli.sh
```

### Method 2: Create Secrets File and Import

1. Create a file with your secrets:
```bash
cat > secrets-prod.txt << 'EOF'
AZURE_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
AZURE_TENANT_ID=42619268-2056-407a-9f6c-72e6741615e5
AZURE_SUBSCRIPTION_ID=c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb
AZURE_RESOURCE_GROUP=echopad-prod-rg
AZURE_WEBAPP_NAME=echopad-prod-api
AZURE_STATIC_WEB_APP_NAME=echopad-prod-frontend
AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN=your_token_here
FRONTEND_URL=https://calm-smoke-0ef35d31e.4.azurestaticapps.net
COSMOS_ENDPOINT=https://echopad-prod-cosmos.documents.azure.com:443/
COSMOS_KEY=your_key_here
COSMOS_DATABASE=echopad-db
VITE_MSAL_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
VITE_MSAL_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
VITE_GOOGLE_CLIENT_ID=606135389544-41ed3f4jm0njuh64k7a97nmrjiur4hsp.apps.googleusercontent.com
VITE_API_BASE_URL=https://echopad-prod-api.azurewebsites.net
GOOGLE_CLIENT_ID=606135389544-41ed3f4jm0njuh64k7a97nmrjiur4hsp.apps.googleusercontent.com
MAGIC_LINK_JWT_SECRET=your_secret_here
AZURE_COMMUNICATION_CONNECTION_STRING=your_connection_string_here
AZURE_COMMUNICATION_SENDER_EMAIL=DoNotReply@cloudsecurityweb.com
EOF
```

2. Run the import script:
```bash
cd /Users/sandeepdaddala/Desktop/CSW/echopad/.github/scripts
./add-secrets-from-file.sh PROD secrets-prod.txt
```

## Secret Names

All secrets use the pattern: `{ENV}_{VARIABLE_NAME}`

- Production: `PROD_*`
- Development: `DEV_*`
- Staging: `STAGING_*`

## Required Secrets

Each environment needs these 19 secrets:

1. `AZURE_CLIENT_ID`
2. `AZURE_TENANT_ID`
3. `AZURE_SUBSCRIPTION_ID`
4. `AZURE_RESOURCE_GROUP`
5. `AZURE_WEBAPP_NAME`
6. `AZURE_STATIC_WEB_APP_NAME`
7. `AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN`
8. `FRONTEND_URL`
9. `COSMOS_ENDPOINT`
10. `COSMOS_KEY`
11. `COSMOS_DATABASE`
12. `VITE_MSAL_CLIENT_ID`
13. `VITE_MSAL_TENANT_ID`
14. `VITE_GOOGLE_CLIENT_ID`
15. `VITE_API_BASE_URL`
16. `GOOGLE_CLIENT_ID`
17. `MAGIC_LINK_JWT_SECRET`
18. `AZURE_COMMUNICATION_CONNECTION_STRING`
19. `AZURE_COMMUNICATION_SENDER_EMAIL`

## Verification

After adding secrets, verify at:
https://github.com/cloudsecurityweb/echopad-website/settings/secrets/actions

## Troubleshooting

### "gh: command not found"
Install GitHub CLI (see Prerequisites above)

### "Not authenticated"
Run: `gh auth login`

### "Permission denied"
Ensure your GitHub token has `repo` permissions

### "Secret already exists"
The script will skip or update existing secrets

## Security Notes

- ⚠️ Never commit secrets files to the repository
- ⚠️ Add `secrets-*.txt` to `.gitignore`
- ⚠️ Delete secrets files after use
- ⚠️ Use secure methods to share secret values
