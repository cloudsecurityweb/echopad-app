#!/bin/bash

# Quick script to add production secrets from secrets-prod.txt
# Usage: ./add-secrets-quick.sh

set -e

REPO="cloudsecurityweb/echopad-website"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRETS_FILE="$SCRIPT_DIR/secrets-prod.txt"

echo "🔐 Quick GitHub Secrets Setup"
echo "Repository: $REPO"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo " GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  brew install gh"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo " Not authenticated with GitHub CLI"
    echo ""
    echo "Authenticate with:"
    echo "  gh auth login"
    echo ""
    exit 1
fi

# Check if secrets file exists
if [ ! -f "$SECRETS_FILE" ]; then
    echo " Secrets file not found: $SECRETS_FILE"
    echo ""
    echo "Create it with the format:"
    echo "  SECRET_NAME=secret_value"
    exit 1
fi

echo " GitHub CLI is installed and authenticated"
echo "📄 Reading secrets from: $SECRETS_FILE"
echo ""

# Count total secrets
TOTAL=$(grep -v '^#' "$SECRETS_FILE" | grep -v '^[[:space:]]*$' | grep '=' | wc -l | xargs)
CURRENT=0

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
    
    # Add PROD prefix
    full_name="PROD_${secret_name}"
    
    CURRENT=$((CURRENT + 1))
    echo -n "[$CURRENT/$TOTAL] Adding $full_name... "
    
    # Check if secret already exists
    if gh secret list --repo "$REPO" 2>/dev/null | grep -q "^$full_name"; then
        echo -n "$secret_value" | gh secret set "$full_name" --repo "$REPO" 2>&1 > /dev/null
        echo " Updated"
    else
        echo -n "$secret_value" | gh secret set "$full_name" --repo "$REPO" 2>&1 > /dev/null
        echo " Added"
    fi
done < "$SECRETS_FILE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " All $TOTAL secrets processed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Verify at: https://github.com/$REPO/settings/secrets/actions"
echo ""
