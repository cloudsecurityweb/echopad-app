# PowerShell script to create dummy data for all containers
# Usage: .\create-all-dummy-data.ps1

$baseUrl = "http://localhost:3000"
$tenantId = "tenant_demo"

Write-Host "Creating dummy data for all containers..." -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Gray
Write-Host "Tenant ID: $tenantId" -ForegroundColor Gray
Write-Host ""

# Define all endpoints
$endpoints = @(
    @{ Name = "Organization"; Path = "/api/organizations/dummy" },
    @{ Name = "User"; Path = "/api/users/dummy" },
    @{ Name = "Product"; Path = "/api/products/dummy" },
    @{ Name = "License"; Path = "/api/licenses/dummy" },
    @{ Name = "Invite"; Path = "/api/invites/dummy" },
    @{ Name = "Audit Event"; Path = "/api/auditEvents/dummy" }
)

$results = @()
$successCount = 0
$failCount = 0

foreach ($endpoint in $endpoints) {
    Write-Host "Creating $($endpoint.Name)..." -ForegroundColor Yellow -NoNewline
    
    try {
        $body = @{
            tenantId = $tenantId
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$baseUrl$($endpoint.Path)" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        Write-Host " Success" -ForegroundColor Green
        Write-Host "   ID: $($response.data.id)" -ForegroundColor Gray
        Write-Host "   Container: $($endpoint.Name)" -ForegroundColor Gray
        
        $results += @{
            Name = $endpoint.Name
            Success = $true
            Data = $response.data
            Error = $null
        }
        $successCount++
    }
    catch {
        Write-Host " Failed" -ForegroundColor Red
        $errorMessage = $_.Exception.Message
        if ($_.ErrorDetails.Message) {
            try {
                $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
                $errorMessage = $errorJson.error + ": " + $errorJson.message
            }
            catch {
                $errorMessage = $_.ErrorDetails.Message
            }
        }
        Write-Host "   Error: $errorMessage" -ForegroundColor Red
        
        $results += @{
            Name = $endpoint.Name
            Success = $false
            Data = $null
            Error = $errorMessage
        }
        $failCount++
    }
    Write-Host ""
}

# Summary
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "   Successful: $successCount/$($endpoints.Count)" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "   Failed: $failCount/$($endpoints.Count)" -ForegroundColor Red
}

if ($successCount -gt 0) {
    Write-Host ""
    Write-Host "Data created! View in CosmosDB:" -ForegroundColor Green
    Write-Host "   1. Go to Azure Portal -> Data Explorer" -ForegroundColor Gray
    Write-Host "   2. Select database: echopad" -ForegroundColor Gray
    Write-Host "   3. Select container: organizations, users, products, licenses, invites, auditEvents" -ForegroundColor Gray
    Write-Host "   4. Run query: SELECT * FROM c WHERE c.tenantId = '$tenantId'" -ForegroundColor Gray
}

if ($failCount -gt 0) {
    Write-Host ""
    Write-Host "Some requests failed. Check:" -ForegroundColor Yellow
    Write-Host "   - Server is running (npm start)" -ForegroundColor Gray
    Write-Host "   - NODE_ENV is not set to production" -ForegroundColor Gray
    Write-Host "   - CosmosDB is configured and connected" -ForegroundColor Gray
}
