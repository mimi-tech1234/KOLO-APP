# Build Kolo App debug APK from the PWA web bundle via Capacitor.
# Prerequisites: Node.js 18+, Android Studio (SDK + JDK 17).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Building web PWA bundle..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Syncing Capacitor Android project..." -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$gradle = Join-Path $root "android\gradlew.bat"
if (-not (Test-Path $gradle)) {
  Write-Host "Android platform missing. Run: npx cap add android" -ForegroundColor Yellow
  exit 1
}

Write-Host "Assembling debug APK..." -ForegroundColor Cyan
Set-Location (Join-Path $root "android")
.\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$apk = Join-Path $root "android\app\build\outputs\apk\debug\app-debug.apk"
Write-Host ""
Write-Host "APK ready:" -ForegroundColor Green
Write-Host $apk
