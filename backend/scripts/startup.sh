#!/bin/bash
set -e

# Install Azure CLI and azure-devops extension if not present (required for exe/dmg download from Azure Artifacts).
if ! command -v az &> /dev/null; then
  echo "[startup] Installing Azure CLI..."
  curl -sL https://aka.ms/InstallAzureCLIDeb | bash
  echo "[startup] Azure CLI installed."
else
  echo "[startup] Azure CLI already installed."
fi

if ! az extension show --name azure-devops &> /dev/null; then
  echo "[startup] Adding Azure DevOps CLI extension..."
  az extension add --name azure-devops --allow-preview true
  echo "[startup] Azure DevOps extension added."
else
  echo "[startup] Azure DevOps extension already present."
fi

echo "[startup] Starting application..."
exec npm start
