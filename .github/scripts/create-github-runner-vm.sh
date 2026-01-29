#!/bin/bash

# Script to create RHEL VM for GitHub Actions Runner in Azure
# Account: sandeepd@deepikachavala2015outlook.onmicrosoft.com

set -e

SUBSCRIPTION="sub-echopad-nonprod"
RESOURCE_GROUP="github-runner-rg"
VM_NAME="github-runner-vm"
LOCATION="eastus"
VM_SIZE="Standard_B2ms"  # Try this size, or Standard_D2s_v5
ADMIN_USERNAME="azureuser"

echo "🔐 Creating GitHub Actions Runner VM"
echo "Subscription: $SUBSCRIPTION"
echo "Resource Group: $RESOURCE_GROUP"
echo "VM Name: $VM_NAME"
echo "Location: $LOCATION"
echo "Size: $VM_SIZE"
echo ""

# Check if logged in
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure"
    echo "Run: az login"
    exit 1
fi

# Switch to correct subscription
echo "📋 Switching to subscription: $SUBSCRIPTION"
az account set --subscription "$SUBSCRIPTION"
az account show --query "{name:name, id:id}" -o json
echo ""

# Create resource group
echo "📦 Creating resource group..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --query "{name:name, location:location}" -o json
echo ""

# Try to create VM with different sizes if one fails
VM_SIZES=("Standard_B2ms" "Standard_D2s_v5" "Standard_D2as_v5" "Standard_B1ms")

for SIZE in "${VM_SIZES[@]}"; do
    echo "💻 Attempting to create VM with size: $SIZE..."
    
    if az vm create \
      --resource-group "$RESOURCE_GROUP" \
      --name "$VM_NAME" \
      --image "RedHat:RHEL:8_8:latest" \
      --size "$SIZE" \
      --admin-username "$ADMIN_USERNAME" \
      --generate-ssh-keys \
      --public-ip-sku Standard \
      --location "$LOCATION" \
      --query "{name:name, publicIp:publicIpAddress, privateIp:privateIpAddress, powerState:powerState}" -o json 2>&1; then
        echo "✅ VM created successfully with size: $SIZE"
        break
    else
        echo "⚠️  Failed with size $SIZE, trying next..."
        continue
    fi
done

# Get VM details
echo ""
echo "📋 VM Details:"
az vm show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --query "{name:name, location:location, size:hardwareProfile.vmSize, powerState:powerState}" -o json

# Get public IP
PUBLIC_IP=$(az vm show -d \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --query publicIps -o tsv)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VM Created Successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Public IP: $PUBLIC_IP"
echo "SSH Command: ssh $ADMIN_USERNAME@$PUBLIC_IP"
echo ""
echo "Next steps:"
echo "1. SSH into the VM: ssh $ADMIN_USERNAME@$PUBLIC_IP"
echo "2. Follow the setup guide: .github/SELF_HOSTED_RUNNER_SETUP.md"
echo ""
