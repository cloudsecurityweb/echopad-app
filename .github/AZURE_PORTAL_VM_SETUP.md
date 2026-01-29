# Create GitHub Runner VM via Azure Portal

Since there are quota restrictions via CLI, here's how to create the VM via Azure Portal.

## Step 1: Login to Azure Portal

1. Go to: https://portal.azure.com
2. Login with: `sandeepd@deepikachavala2015outlook.onmicrosoft.com`
3. Switch to subscription: `sub-echopad-nonprod`

## Step 2: Create Resource Group

1. Search for "Resource groups" in the top search bar
2. Click "Create"
3. Fill in:
   - **Resource group**: `github-runner-rg`
   - **Region**: `East US` (or any available region)
4. Click "Review + create" → "Create"

## Step 3: Create Virtual Machine

1. Search for "Virtual machines" in the top search bar
2. Click "Create" → "Azure virtual machine"

### Basics Tab

- **Subscription**: `sub-echopad-nonprod`
- **Resource group**: `github-runner-rg`
- **Virtual machine name**: `github-runner-vm`
- **Region**: `East US` (or same as resource group)
- **Availability options**: No infrastructure redundancy required
- **Image**: 
  - Click "See all images"
  - Search for "Red Hat Enterprise Linux"
  - Select "Red Hat Enterprise Linux 8_8"
- **VM architecture**: x64
- **Size**: 
  - Click "See all sizes"
  - Try: `Standard_B2ms` (2 vCPUs, 8 GB RAM) - **Cheapest option**
  - Or: `Standard_D2s_v5` (2 vCPUs, 8 GB RAM)
  - If not available, try any `Standard_B` or `Standard_D` series with 2+ vCPUs
- **Authentication type**: SSH public key
- **Username**: `azureuser`
- **SSH public key source**: Generate new key pair
- **Key pair name**: `github-runner-key` (or leave default)

### Disks Tab

- **OS disk type**: Premium SSD (or Standard SSD for cheaper)
- Leave other defaults

### Networking Tab

- **Virtual network**: Create new (default name is fine)
- **Subnet**: Default
- **Public IP**: Create new (default name is fine)
- **NIC network security group**: Basic
- **Public inbound ports**: Allow selected ports
- **Select inbound ports**: SSH (22)

### Management Tab

- **Boot diagnostics**: Enable (recommended)
- Leave other defaults

### Monitoring Tab

- Leave defaults

### Advanced Tab

- Leave defaults

### Tags Tab

- Optional: Add tags like:
  - `Purpose`: `GitHub Actions Runner`
  - `Environment`: `Production`

### Review + Create

1. Click "Review + create"
2. Wait for validation
3. Click "Create"
4. **Important**: Download the SSH private key when prompted (you'll need it to connect)

## Step 4: Get VM Details

After creation:

1. Go to the VM resource
2. Note the **Public IP address**
3. The SSH key was downloaded to your computer

## Step 5: Connect to VM

### On macOS/Linux:

```bash
# The key was downloaded, find it (usually in Downloads)
# It's named something like: github-runner-key.pem

# Set permissions
chmod 400 ~/Downloads/github-runner-key.pem

# Connect
ssh -i ~/Downloads/github-runner-key.pem azureuser@<PUBLIC_IP>
```

### On Windows:

Use PuTTY or WSL with the same command as above.

## Step 6: Setup GitHub Runner

Once connected to the VM, follow: `.github/SELF_HOSTED_RUNNER_SETUP.md`

Quick commands:
```bash
# Update system
sudo dnf update -y

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIRHEL | sudo bash

# Install Git
sudo dnf install -y git

# Install GitHub Actions Runner
# (Follow instructions from GitHub repository settings)
```

## Troubleshooting

### Quota Issues

If you get quota errors:
1. Try a different VM size (smaller)
2. Try a different region
3. Request quota increase: Azure Portal → Subscriptions → Usage + quotas

### SSH Connection Issues

1. Check Network Security Group allows SSH (port 22)
2. Verify public IP is correct
3. Check SSH key permissions: `chmod 400 key.pem`

### VM Not Starting

1. Check boot diagnostics in Azure Portal
2. Review VM logs
3. Try restarting the VM

## Cost Estimate

- **Standard_B2ms**: ~$60-80/month (burstable, good for intermittent use)
- **Standard_D2s_v5**: ~$100-120/month (consistent performance)

For GitHub Actions runner, `Standard_B2ms` is usually sufficient and cheaper.
