# Individual commands to create dummy data for each container
# Make sure your server is running first: npm start
# Then run these commands one by one or all at once

$baseUrl = "http://localhost:3000"
$tenantId = "tenant_demo"

Write-Host "Creating dummy data for all containers..." -ForegroundColor Cyan
Write-Host ""

# Organization
Write-Host "Creating Organization..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/api/organizations/dummy" -Method POST -ContentType "application/json" -Body "{`"tenantId`":`"$tenantId`"}"
Write-Host ""

# User
Write-Host "Creating User..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/api/users/dummy" -Method POST -ContentType "application/json" -Body "{`"tenantId`":`"$tenantId`"}"
Write-Host ""

# Product
Write-Host "Creating Product..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/api/products/dummy" -Method POST -ContentType "application/json" -Body "{`"tenantId`":`"$tenantId`"}"
Write-Host ""

# License
Write-Host "Creating License..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/api/licenses/dummy" -Method POST -ContentType "application/json" -Body "{`"tenantId`":`"$tenantId`"}"
Write-Host ""

# Invite
Write-Host "Creating Invite..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/api/invites/dummy" -Method POST -ContentType "application/json" -Body "{`"tenantId`":`"$tenantId`"}"
Write-Host ""

# Audit Event
Write-Host "Creating Audit Event..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/api/auditEvents/dummy" -Method POST -ContentType "application/json" -Body "{`"tenantId`":`"$tenantId`"}"
Write-Host ""

Write-Host "Done! Check CosmosDB for the created data." -ForegroundColor Green
