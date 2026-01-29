#!/bin/bash

# Script to add GitHub Secrets using GitHub CLI
# Repository: cloudsecurityweb/echopad-website

set -e

REPO="cloudsecurityweb/echopad-website"

echo "🔐 GitHub Secrets Setup Script"
echo "Repository: $REPO"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install gh"
    echo "  Linux: See https://cli.github.com/"
    echo "  Windows: winget install GitHub.cli"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo ""
    echo "Authenticate with:"
    echo "  gh auth login"
    echo ""
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Function to add secret
add_secret() {
    local secret_name=$1
    local secret_value=$2
    local env_prefix=$3
    
    if [ -n "$env_prefix" ]; then
        full_name="${env_prefix}_${secret_name}"
    else
        full_name="$secret_name"
    fi
    
    echo -n "Adding $full_name... "
    
    # Check if secret already exists
    if gh secret list --repo "$REPO" | grep -q "^$full_name"; then
        echo "⚠️  Already exists (skipping)"
    else
        echo "$secret_value" | gh secret set "$full_name" --repo "$REPO"
        echo "✅ Added"
    fi
}

# Function to prompt for secret value
prompt_secret() {
    local secret_name=$1
    local env_prefix=$2
    local default_value=$3
    
    if [ -n "$env_prefix" ]; then
        full_name="${env_prefix}_${secret_name}"
    else
        full_name="$secret_name"
    fi
    
    if [ -n "$default_value" ]; then
        read -p "Enter $full_name [$default_value]: " value
        value=${value:-$default_value}
    else
        read -p "Enter $full_name: " value
    fi
    
    if [ -n "$value" ]; then
        add_secret "$secret_name" "$value" "$env_prefix"
    fi
}

# Select environment
echo "Select environment:"
echo "1) Production (PROD)"
echo "2) Development (DEV)"
echo "3) Staging (STAGING)"
echo "4) All environments"
read -p "Choice [1-4]: " env_choice

case $env_choice in
    1) ENV_PREFIX="PROD" ;;
    2) ENV_PREFIX="DEV" ;;
    3) ENV_PREFIX="STAGING" ;;
    4) ENV_PREFIX="ALL" ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

echo ""
echo "📝 Adding secrets for: $ENV_PREFIX"
echo ""

if [ "$ENV_PREFIX" = "ALL" ]; then
    # Add for all environments
    for env in PROD DEV STAGING; do
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Environment: $env"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Azure Authentication
        prompt_secret "AZURE_CLIENT_ID" "$env"
        prompt_secret "AZURE_TENANT_ID" "$env"
        prompt_secret "AZURE_SUBSCRIPTION_ID" "$env"
        
        # Azure Resources
        prompt_secret "AZURE_RESOURCE_GROUP" "$env"
        prompt_secret "AZURE_WEBAPP_NAME" "$env"
        prompt_secret "AZURE_STATIC_WEB_APP_NAME" "$env"
        prompt_secret "AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN" "$env"
        
        # URLs & Database
        prompt_secret "FRONTEND_URL" "$env"
        prompt_secret "COSMOS_ENDPOINT" "$env"
        prompt_secret "COSMOS_KEY" "$env"
        prompt_secret "COSMOS_DATABASE" "$env"
        
        # Frontend Build Variables
        prompt_secret "VITE_MSAL_CLIENT_ID" "$env"
        prompt_secret "VITE_MSAL_TENANT_ID" "$env"
        prompt_secret "VITE_GOOGLE_CLIENT_ID" "$env"
        prompt_secret "VITE_API_BASE_URL" "$env"
        
        # Backend Environment Variables
        prompt_secret "GOOGLE_CLIENT_ID" "$env"
        prompt_secret "MAGIC_LINK_JWT_SECRET" "$env"
        prompt_secret "AZURE_COMMUNICATION_CONNECTION_STRING" "$env"
        prompt_secret "AZURE_COMMUNICATION_SENDER_EMAIL" "$env"
        
        echo ""
    done
else
    # Add for single environment
    # Azure Authentication
    prompt_secret "AZURE_CLIENT_ID" "$ENV_PREFIX"
    prompt_secret "AZURE_TENANT_ID" "$ENV_PREFIX"
    prompt_secret "AZURE_SUBSCRIPTION_ID" "$ENV_PREFIX"
    
    # Azure Resources
    prompt_secret "AZURE_RESOURCE_GROUP" "$ENV_PREFIX"
    prompt_secret "AZURE_WEBAPP_NAME" "$ENV_PREFIX"
    prompt_secret "AZURE_STATIC_WEB_APP_NAME" "$ENV_PREFIX"
    prompt_secret "AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN" "$ENV_PREFIX"
    
    # URLs & Database
    prompt_secret "FRONTEND_URL" "$ENV_PREFIX"
    prompt_secret "COSMOS_ENDPOINT" "$ENV_PREFIX"
    prompt_secret "COSMOS_KEY" "$ENV_PREFIX"
    prompt_secret "COSMOS_DATABASE" "$ENV_PREFIX"
    
    # Frontend Build Variables
    prompt_secret "VITE_MSAL_CLIENT_ID" "$ENV_PREFIX"
    prompt_secret "VITE_MSAL_TENANT_ID" "$ENV_PREFIX"
    prompt_secret "VITE_GOOGLE_CLIENT_ID" "$ENV_PREFIX"
    prompt_secret "VITE_API_BASE_URL" "$ENV_PREFIX"
    
    # Backend Environment Variables
    prompt_secret "GOOGLE_CLIENT_ID" "$ENV_PREFIX"
    prompt_secret "MAGIC_LINK_JWT_SECRET" "$ENV_PREFIX"
    prompt_secret "AZURE_COMMUNICATION_CONNECTION_STRING" "$ENV_PREFIX"
    prompt_secret "AZURE_COMMUNICATION_SENDER_EMAIL" "$ENV_PREFIX"
fi

echo ""
echo "✅ All secrets added successfully!"
echo ""
echo "Verify at: https://github.com/$REPO/settings/secrets/actions"
