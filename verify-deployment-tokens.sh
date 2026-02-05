#!/bin/bash

echo "🔍 Azure Static Web App Deployment Token Verification"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to retrieve token from Azure
get_token_from_azure() {
    local swa_name=$1
    local resource_group=$2
    local env_name=$3
    local subscription=$4
    
    echo "📋 Retrieving $env_name deployment token from Azure..."
    echo "   Static Web App: $swa_name"
    echo "   Resource Group: $resource_group"
    echo "   Subscription: $subscription"
    
    # Set subscription first
    az account set --subscription "$subscription" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Could not set subscription (might not have access)${NC}"
        return 1
    fi
    
    # Try the secrets list command
    TOKEN_OUTPUT=$(az staticwebapp secrets list \
        --name "$swa_name" \
        --resource-group "$resource_group" \
        --query "properties.apiKey" -o tsv 2>&1)
    
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ] && [ -n "$TOKEN_OUTPUT" ] && [ "$TOKEN_OUTPUT" != "null" ] && ! echo "$TOKEN_OUTPUT" | grep -qi "error"; then
        echo -e "${GREEN}✅ Token retrieved successfully${NC}"
        echo "$TOKEN_OUTPUT"
        return 0
    else
        echo -e "${RED}❌ Failed to retrieve token${NC}"
        if [ $EXIT_CODE -ne 0 ]; then
            echo "   Exit code: $EXIT_CODE"
        fi
        if [ -n "$TOKEN_OUTPUT" ]; then
            echo "   Error: $TOKEN_OUTPUT"
        fi
        return 1
    fi
}

# Function to verify token format
verify_token_format() {
    local token=$1
    # Token format: 64 hex chars - 8 hex - 4 hex - 4 hex - 12 hex + 20 hex = ~113 chars
    if [ ${#token} -gt 100 ] && [[ "$token" =~ ^[a-f0-9-]+$ ]]; then
        return 0
    else
        return 1
    fi
}

# Check current Azure login
echo "🔐 Checking Azure authentication..."
CURRENT_ACCOUNT=$(az account show --query "{name:name, id:id}" -o json 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Logged into Azure${NC}"
    ACCOUNT_NAME=$(echo "$CURRENT_ACCOUNT" | grep -o '"name": "[^"]*"' | head -1 | cut -d'"' -f4)
    ACCOUNT_ID=$(echo "$CURRENT_ACCOUNT" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   Account: $ACCOUNT_NAME"
    echo "   Subscription ID: $ACCOUNT_ID"
else
    echo -e "${RED}❌ Not logged into Azure. Please run 'az login' first${NC}"
    exit 1
fi

echo ""
echo "=================================================="
echo ""

# DEV Configuration
echo -e "${BLUE}🔵 DEVELOPMENT ENVIRONMENT${NC}"
echo "-------------------------"
DEV_SWA_NAME="echopad-frontend"
DEV_RESOURCE_GROUP="cosmosdb-serverless-nonprod"
DEV_SUBSCRIPTION="c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2"

DEV_TOKEN_RESULT=$(get_token_from_azure "$DEV_SWA_NAME" "$DEV_RESOURCE_GROUP" "DEV" "$DEV_SUBSCRIPTION")
DEV_TOKEN_RET=$?

if [ $DEV_TOKEN_RET -eq 0 ]; then
    # Extract just the token (first line that looks like a token)
    DEV_TOKEN=$(echo "$DEV_TOKEN_RESULT" | grep -oE '^[a-f0-9-]{100,}$' | head -1)
    
    if [ -n "$DEV_TOKEN" ] && verify_token_format "$DEV_TOKEN"; then
        echo -e "${GREEN}✅ DEV token format is valid${NC}"
        echo ""
        echo "📝 DEV Token (first 30 chars): ${DEV_TOKEN:0:30}..."
        echo "📝 DEV Token (last 30 chars): ...${DEV_TOKEN: -30}"
        echo "📏 Token length: ${#DEV_TOKEN} characters"
        echo ""
        echo -e "🔑 GitHub Secret Name: ${BLUE}DEV_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN${NC}"
        echo ""
        echo "📋 Full Token Value:"
        echo "$DEV_TOKEN"
        echo ""
    else
        echo -e "${RED}❌ DEV token validation failed${NC}"
        DEV_TOKEN=""
    fi
else
    echo -e "${RED}❌ DEV token retrieval failed${NC}"
    DEV_TOKEN=""
fi

echo ""
echo "=================================================="
echo ""

# PROD Configuration
echo -e "${RED}🔴 PRODUCTION ENVIRONMENT${NC}"
echo "-------------------------"
PROD_SWA_NAME="echopad-frontend"
PROD_RESOURCE_GROUP="cosmosdb-serverless-prd"
PROD_SUBSCRIPTION="c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb"

PROD_TOKEN_RESULT=$(get_token_from_azure "$PROD_SWA_NAME" "$PROD_RESOURCE_GROUP" "PROD" "$PROD_SUBSCRIPTION")
PROD_TOKEN_RET=$?

if [ $PROD_TOKEN_RET -eq 0 ]; then
    # Extract just the token (first line that looks like a token)
    PROD_TOKEN=$(echo "$PROD_TOKEN_RESULT" | grep -oE '^[a-f0-9-]{100,}$' | head -1)
    
    if [ -n "$PROD_TOKEN" ] && verify_token_format "$PROD_TOKEN"; then
        echo -e "${GREEN}✅ PROD token format is valid${NC}"
        echo ""
        echo "📝 PROD Token (first 30 chars): ${PROD_TOKEN:0:30}..."
        echo "📝 PROD Token (last 30 chars): ...${PROD_TOKEN: -30}"
        echo "📏 Token length: ${#PROD_TOKEN} characters"
        echo ""
        echo -e "🔑 GitHub Secret Name: ${BLUE}PROD_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN${NC}"
        echo ""
        echo "📋 Full Token Value:"
        echo "$PROD_TOKEN"
        echo ""
    else
        echo -e "${RED}❌ PROD token validation failed${NC}"
        PROD_TOKEN=""
    fi
else
    echo -e "${YELLOW}⚠️  PROD token retrieval failed (might not have access or resource doesn't exist)${NC}"
    PROD_TOKEN=""
fi

echo ""
echo "=================================================="
echo ""
echo "📋 VERIFICATION SUMMARY"
echo "======================"
echo ""

if [ -n "$DEV_TOKEN" ]; then
    echo -e "${GREEN}✅ DEV token retrieved from Azure${NC}"
    echo "   → Verify GitHub secret 'DEV_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN' matches above"
    echo "   → Token length: ${#DEV_TOKEN} characters"
    echo "   → First 10 chars: ${DEV_TOKEN:0:10}..."
    echo "   → Last 10 chars: ...${DEV_TOKEN: -10}"
else
    echo -e "${RED}❌ DEV token could not be retrieved${NC}"
fi

echo ""

if [ -n "$PROD_TOKEN" ]; then
    echo -e "${GREEN}✅ PROD token retrieved from Azure${NC}"
    echo "   → Verify GitHub secret 'PROD_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN' matches above"
    echo "   → Token length: ${#PROD_TOKEN} characters"
    echo "   → First 10 chars: ${PROD_TOKEN:0:10}..."
    echo "   → Last 10 chars: ...${PROD_TOKEN: -10}"
else
    echo -e "${YELLOW}⚠️  PROD token could not be retrieved${NC}"
fi

echo ""
echo "=================================================="
echo ""
echo "🔧 HOW TO VERIFY IN GITHUB:"
echo "1. Go to: https://github.com/cloudsecurityweb/echopad-app/settings/secrets/actions"
echo "2. For DEV: Click 'DEV_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN' → 'Update'"
echo "3. For PROD: Click 'PROD_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN' → 'Update'"
echo "4. The value will be masked, but you can compare:"
echo "   - First 10 characters should match"
echo "   - Last 10 characters should match"
echo "   - Total length should match"
echo "5. If they don't match, copy the token above and update the secret"
echo ""

# Save tokens to a file for reference (but don't commit it)
if [ -n "$DEV_TOKEN" ] || [ -n "$PROD_TOKEN" ]; then
    OUTPUT_FILE=".github/current-deployment-tokens.txt"
    mkdir -p .github
    cat > "$OUTPUT_FILE" << EOF
# Current Deployment Tokens from Azure
# Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
# DO NOT COMMIT THIS FILE - It contains sensitive information
# Add this file to .gitignore if not already there

## DEV Environment
# Static Web App: echopad-frontend
# Resource Group: cosmosdb-serverless-nonprod
# Subscription: c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2
DEV_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN=$DEV_TOKEN

## PROD Environment
# Static Web App: echopad-frontend
# Resource Group: cosmosdb-serverless-prd
# Subscription: c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb
PROD_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN=$PROD_TOKEN
EOF
    echo "💾 Tokens saved to: $OUTPUT_FILE (DO NOT COMMIT THIS FILE)"
    echo "   → This file is for your reference only"
    echo ""
    
    # Check if file is in .gitignore
    if [ -f .gitignore ] && grep -q "$OUTPUT_FILE" .gitignore; then
        echo -e "${GREEN}✅ File is already in .gitignore${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING: Add '$OUTPUT_FILE' to .gitignore to prevent committing secrets${NC}"
    fi
    echo ""
fi

echo "✅ Verification complete!"
