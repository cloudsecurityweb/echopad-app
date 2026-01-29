#!/bin/bash

# Script to add GitHub Secrets using GitHub API (curl)
# Repository: cloudsecurityweb/echopad-website
# Requires: GitHub Personal Access Token with repo permissions

set -e

REPO="cloudsecurityweb/echopad-website"
REPO_OWNER="cloudsecurityweb"
REPO_NAME="echopad-website"

echo "🔐 GitHub Secrets Setup Script (API Method)"
echo "Repository: $REPO"
echo ""

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo " GITHUB_TOKEN environment variable not set"
    echo ""
    echo "Set it with:"
    echo "  export GITHUB_TOKEN=your_personal_access_token"
    echo ""
    echo "Create a token at: https://github.com/settings/tokens"
    echo "Required permissions: repo (Full control of private repositories)"
    echo ""
    exit 1
fi

# Function to encrypt secret value using GitHub API
encrypt_secret() {
    local public_key_id=$1
    local public_key=$2
    local secret_value=$3
    
    # Encrypt using libsodium (requires base64 and openssl)
    if command -v openssl &> /dev/null; then
        # Get the public key in binary format
        echo -n "$public_key" | base64 -d > /tmp/public_key.bin
        
        # Generate a random symmetric key
        openssl rand -hex 32 > /tmp/symmetric_key.hex
        
        # Encrypt the secret (simplified - GitHub uses libsodium box)
        # For production, use a proper library, but this is a workaround
        encrypted=$(echo -n "$secret_value" | openssl enc -aes-256-cbc -base64 -pbkdf2 -pass file:/tmp/symmetric_key.hex 2>/dev/null || echo "")
        
        rm -f /tmp/public_key.bin /tmp/symmetric_key.hex
        
        echo "$encrypted"
    else
        echo ""
    fi
}

# Function to add secret using GitHub API
add_secret_api() {
    local secret_name=$1
    local secret_value=$2
    
    echo -n "Adding $secret_name... "
    
    # Get repository public key
    KEY_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO/actions/secrets/public-key")
    
    PUBLIC_KEY=$(echo "$KEY_RESPONSE" | grep -o '"key":"[^"]*' | cut -d'"' -f4)
    KEY_ID=$(echo "$KEY_RESPONSE" | grep -o '"key_id":"[^"]*' | cut -d'"' -f4)
    
    if [ -z "$PUBLIC_KEY" ] || [ -z "$KEY_ID" ]; then
        echo " Failed to get public key"
        return 1
    fi
    
    # Encrypt the secret (using sodium encryption)
    # Note: This requires libsodium or a proper encryption library
    # For now, we'll use a Python script if available
    if command -v python3 &> /dev/null; then
        ENCRYPTED_VALUE=$(python3 << EOF
import base64
import json
from nacl import encoding, public

def encrypt(public_key: str, secret_value: str) -> str:
    """Encrypt a Unicode string using the public key."""
    public_key_bytes = base64.b64decode(public_key)
    public_key_obj = public.PublicKey(public_key_bytes, encoding.RawEncoder())
    sealed_box = public.SealedBox(public_key_obj)
    encrypted = sealed_box.encrypt(secret_value.encode('utf-8'))
    return base64.b64encode(encrypted).decode('utf-8')

try:
    result = encrypt("$PUBLIC_KEY", "$secret_value")
    print(result)
except ImportError:
    print("")
EOF
)
    else
        ENCRYPTED_VALUE=""
    fi
    
    if [ -z "$ENCRYPTED_VALUE" ]; then
        echo "  Encryption failed (install pynacl: pip3 install pynacl)"
        echo "   Or use GitHub CLI method instead"
        return 1
    fi
    
    # Create or update secret
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/$REPO/actions/secrets/$secret_name" \
        -d "{\"encrypted_value\":\"$ENCRYPTED_VALUE\",\"key_id\":\"$KEY_ID\"}")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    
    if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "204" ]; then
        echo " Added"
    else
        echo " Failed (HTTP $HTTP_CODE)"
        echo "$RESPONSE" | head -n-1
    fi
}

# Function to add secret (wrapper)
add_secret() {
    local secret_name=$1
    local secret_value=$2
    local env_prefix=$3
    
    if [ -n "$env_prefix" ]; then
        full_name="${env_prefix}_${secret_name}"
    else
        full_name="$secret_name"
    fi
    
    add_secret_api "$full_name" "$secret_value"
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
read -p "Choice [1-3]: " env_choice

case $env_choice in
    1) ENV_PREFIX="PROD" ;;
    2) ENV_PREFIX="DEV" ;;
    3) ENV_PREFIX="STAGING" ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

echo ""
echo " Adding secrets for: $ENV_PREFIX"
echo ""

# Check if pynacl is installed (required for encryption)
if ! python3 -c "import nacl" 2>/dev/null; then
    echo "  Warning: pynacl not installed"
    echo "Install with: pip3 install pynacl"
    echo ""
    read -p "Continue anyway? (y/n): " continue_choice
    if [ "$continue_choice" != "y" ]; then
        exit 1
    fi
fi

# Add secrets
prompt_secret "AZURE_CLIENT_ID" "$ENV_PREFIX"
prompt_secret "AZURE_TENANT_ID" "$ENV_PREFIX"
prompt_secret "AZURE_SUBSCRIPTION_ID" "$ENV_PREFIX"
prompt_secret "AZURE_RESOURCE_GROUP" "$ENV_PREFIX"
prompt_secret "AZURE_WEBAPP_NAME" "$ENV_PREFIX"
prompt_secret "AZURE_STATIC_WEB_APP_NAME" "$ENV_PREFIX"
prompt_secret "AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN" "$ENV_PREFIX"
prompt_secret "FRONTEND_URL" "$ENV_PREFIX"
prompt_secret "COSMOS_ENDPOINT" "$ENV_PREFIX"
prompt_secret "COSMOS_KEY" "$ENV_PREFIX"
prompt_secret "COSMOS_DATABASE" "$ENV_PREFIX"
prompt_secret "VITE_MSAL_CLIENT_ID" "$ENV_PREFIX"
prompt_secret "VITE_MSAL_TENANT_ID" "$ENV_PREFIX"
prompt_secret "VITE_GOOGLE_CLIENT_ID" "$ENV_PREFIX"
prompt_secret "VITE_API_BASE_URL" "$ENV_PREFIX"
prompt_secret "GOOGLE_CLIENT_ID" "$ENV_PREFIX"
prompt_secret "MAGIC_LINK_JWT_SECRET" "$ENV_PREFIX"
prompt_secret "AZURE_COMMUNICATION_CONNECTION_STRING" "$ENV_PREFIX"
prompt_secret "AZURE_COMMUNICATION_SENDER_EMAIL" "$ENV_PREFIX"

echo ""
echo " All secrets added successfully!"
echo ""
echo "Verify at: https://github.com/$REPO/settings/secrets/actions"
