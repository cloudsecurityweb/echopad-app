#!/bin/bash
# Script to format Azure credentials for GitHub Secrets
# Run this to get the JSON format for PROD_AZURE_CREDS

CLIENT_ID="d4ea5537-8b2a-4b88-9dbd-80bf02596c1a"
# Get the secret value from Azure or use the one provided
# CLIENT_SECRET="YOUR_SECRET_VALUE_HERE"
CLIENT_SECRET="${AZURE_CLIENT_SECRET:-YOUR_SECRET_VALUE_HERE}"
TENANT_ID="42619268-2056-407a-9f6c-72e6741615e5"
SUBSCRIPTION_ID="c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2"

echo "📋 PROD_AZURE_CREDS JSON (copy this entire block):"
echo ""
cat << EOF
{
  "clientId": "$CLIENT_ID",
  "clientSecret": "$CLIENT_SECRET",
  "tenantId": "$TENANT_ID",
  "subscriptionId": "$SUBSCRIPTION_ID"
}
EOF

echo ""
echo "✅ Copy the JSON above and paste it into GitHub Secret: PROD_AZURE_CREDS"
echo ""
echo "🔗 GitHub Secret URL:"
echo "   https://github.com/cloudsecurityweb/echopad-app/settings/secrets/actions"
