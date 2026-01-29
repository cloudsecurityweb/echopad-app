#!/bin/bash

# Script to add GitHub Secrets from a file using GitHub CLI
# Usage: ./add-secrets-from-file.sh <environment> <secrets-file>
# Example: ./add-secrets-from-file.sh PROD secrets-prod.txt

set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <environment> <secrets-file>"
    echo ""
    echo "Example:"
    echo "  $0 PROD secrets-prod.txt"
    echo "  $0 DEV secrets-dev.txt"
    echo ""
    echo "Secrets file format (one per line):"
    echo "  SECRET_NAME=secret_value"
    echo ""
    exit 1
fi

ENV_PREFIX=$1
SECRETS_FILE=$2
REPO="cloudsecurityweb/echopad-website"

if [ ! -f "$SECRETS_FILE" ]; then
    echo " Secrets file not found: $SECRETS_FILE"
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo " GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install gh"
    echo "  Linux: See https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo " Not authenticated with GitHub CLI"
    echo ""
    echo "Authenticate with:"
    echo "  gh auth login"
    exit 1
fi

echo "🔐 Adding secrets from file: $SECRETS_FILE"
echo "Environment: $ENV_PREFIX"
echo "Repository: $REPO"
echo ""

# Read secrets file and add each one
while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines and comments
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    
    # Remove leading/trailing whitespace
    line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Skip if empty after trimming
    [ -z "$line" ] && continue
    
    # Split on first '=' only
    secret_name="${line%%=*}"
    secret_value="${line#*=}"
    
    # Remove leading/trailing whitespace from name and value
    secret_name=$(echo "$secret_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    secret_value=$(echo "$secret_value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Skip if name is empty
    [ -z "$secret_name" ] && continue
    
    # Add environment prefix
    full_name="${ENV_PREFIX}_${secret_name}"
    
    echo -n "Adding $full_name... "
    
    # Check if secret already exists
    if gh secret list --repo "$REPO" 2>/dev/null | grep -q "^$full_name"; then
        echo "  Already exists (updating...)"
        echo -n "$secret_value" | gh secret set "$full_name" --repo "$REPO"
        echo "  Updated"
    else
        echo -n "$secret_value" | gh secret set "$full_name" --repo "$REPO"
        echo "  Added"
    fi
done < "$SECRETS_FILE"

echo ""
echo " All secrets processed!"
echo ""
echo "Verify at: https://github.com/$REPO/settings/secrets/actions"
