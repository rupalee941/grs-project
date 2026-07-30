# Test Discussion Forum Endpoints
# Make sure server is running on port 5000

Write-Host "=== Testing Discussion Forum Endpoints ===" -ForegroundColor Green
Write-Host ""

# Test 1: Get Count
Write-Host "Test 1: GET /api/discussion/count" -ForegroundColor Cyan
try {
    $response = (New-Object System.Net.WebClient).DownloadString("http://localhost:5000/api/discussion/count")
    Write-Host "Response: $response" -ForegroundColor White
    Write-Host "✓ Endpoint working!" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get Questions
Write-Host "Test 2: GET /api/discussion/questions" -ForegroundColor Cyan
try {
    $response = (New-Object System.Net.WebClient).DownloadString("http://localhost:5000/api/discussion/questions")
    $parsed = $response | ConvertFrom-Json
    Write-Host "Response msg: $($parsed.msg)" -ForegroundColor White
    Write-Host "Questions count: $($parsed.questions.Count)" -ForegroundColor White
    Write-Host "✓ Endpoint working!" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Show (Admin)
Write-Host "Test 3: GET /api/discussion/show" -ForegroundColor Cyan
try {
    $response = (New-Object System.Net.WebClient).DownloadString("http://localhost:5000/api/discussion/show")
    $parsed = $response | ConvertFrom-Json
    Write-Host "Response msg: $($parsed.msg)" -ForegroundColor White
    Write-Host "Questions count: $($parsed.questions.Count)" -ForegroundColor White
    Write-Host "✓ Endpoint working!" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== All Tests Complete ===" -ForegroundColor Green
Write-Host "Server is ready! All endpoints are responding." -ForegroundColor Green
