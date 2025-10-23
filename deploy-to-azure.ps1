# Get publishing credentials
Write-Host "Getting publishing credentials..." -ForegroundColor Yellow
$creds = az webapp deployment list-publishing-credentials --name curbsidecuisine-api --resource-group CurbsideCuisineRG | ConvertFrom-Json

$username = $creds.publishingUserName
$password = $creds.publishingPassword
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username, $password)))

# Upload the zip
Write-Host "Deploying application..." -ForegroundColor Yellow
$apiUrl = "https://curbsidecuisine-api.scm.azurewebsites.net/api/zipdeploy"
$zipFile = "C:\Users\patri\OneDrive\Desktop\CurbsideCuisine\CurbsideAPI\deploy.zip"

$headers = @{
    Authorization = ("Basic {0}" -f $base64AuthInfo)
}

try {
    Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method POST -InFile $zipFile -ContentType "multipart/form-data" -TimeoutSec 300
    Write-Host "Deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "Deployment failed: $_" -ForegroundColor Red
}
