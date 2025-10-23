$API_BASE = "https://curbsidecuisine-api.azurewebsites.net/api"

Write-Host "Starting database seeding..." -ForegroundColor Cyan

# Read seed data
$seedData = Get-Content "seed-data.json" | ConvertFrom-Json

# 1. Register Users
Write-Host "`n1. Creating users..." -ForegroundColor Yellow
$tokens = @{ }

foreach ($user in $seedData.users) {
    Write-Host "  - Registering $($user.userName)..." -NoNewline
    
    $preferredRadiusValue = 5
    if ($user.preferredRadius) {
        $preferredRadiusValue = $user.preferredRadius
    }
    
    $body = @{
        userName = $user.userName
        email = $user.email
        password = $user.password
        role = $user.role
        preferredRadius = $preferredRadiusValue
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/Auth/register" -Method Post -Body $body -ContentType "application/json"
        $tokens[$user.role] = $response.data.token
        Write-Host " Done" -ForegroundColor Green
    } catch {
        Write-Host " Error: $_" -ForegroundColor Red
    }
}

# 2. Create Food Truck (as vendor)
Write-Host "`n2. Creating food truck..." -ForegroundColor Yellow
$vendorToken = $tokens["vendor"]
$headers = @{
    "Authorization" = "Bearer $vendorToken"
    "Content-Type" = "application/json"
}

$foodTruckBody = $seedData.foodTruck | ConvertTo-Json

try {
    $foodTruckResponse = Invoke-RestMethod -Uri "$API_BASE/FoodTruck" -Method Post -Headers $headers -Body $foodTruckBody
    $foodTruckId = $foodTruckResponse.data.foodTruckId
    Write-Host "  - Food truck created with ID: $foodTruckId Done" -ForegroundColor Green
} catch {
    Write-Host "  - Error creating food truck: $_" -ForegroundColor Red
    exit
}

# 3. Add Menu Items
Write-Host "`n3. Adding menu items..." -ForegroundColor Yellow
foreach ($item in $seedData.menuItems) {
    Write-Host "  - Adding $($item.name)..." -NoNewline
    
    $menuBody = $item | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$API_BASE/MenuItem/foodtruck/$foodTruckId" -Method Post -Headers $headers -Body $menuBody | Out-Null
        Write-Host " Done" -ForegroundColor Green
    } catch {
        Write-Host " Error: $_" -ForegroundColor Red
    }
}

# 4. Add Review (as user)
Write-Host "`n4. Adding review..." -ForegroundColor Yellow
$userToken = $tokens["appuser"]
$userHeaders = @{
    "Authorization" = "Bearer $userToken"
    "Content-Type" = "application/json"
}

$reviewBody = $seedData.review | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$API_BASE/Review/foodtruck/$foodTruckId" -Method Post -Headers $userHeaders -Body $reviewBody | Out-Null
    Write-Host "  - Review added Done" -ForegroundColor Green
} catch {
    Write-Host "  - Error adding review: $_" -ForegroundColor Red
}

Write-Host "`nDatabase seeding complete!" -ForegroundColor Green
Write-Host "`nCredentials:" -ForegroundColor Cyan
Write-Host "  Admin:  admin@curbside.com / Admin123!"
Write-Host "  Vendor: vendor@curbside.com / Vendor123!"
Write-Host "  User:   user@curbside.com / User123!"
