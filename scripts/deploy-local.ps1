# =============================================================================
# HyperParts Suite — Local Deployment Script (PowerShell)
# =============================================================================
# Builds and deploys .sppkg to your SharePoint tenant App Catalog.
# Usage:
#   .\scripts\deploy-local.ps1 -AppCatalogUrl "https://mf7m.sharepoint.com/sites/appcatalog"
#
# Prerequisites:
#   - Node 18.x, npm, gulp installed
#   - CLI for Microsoft 365 installed: npm install -g @pnp/cli-microsoft365
#   - Logged in: m365 login
# =============================================================================

param(
    [Parameter(Mandatory = $true)]
    [string]$AppCatalogUrl,

    [switch]$SkipBuild,
    [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"
$sppkgName = "hyperparts-suite.sppkg"
$solutionDir = Join-Path $PSScriptRoot ".." "sharepoint" "solution"
$sppkgPath = Join-Path $solutionDir $sppkgName

Write-Host "`n=== HyperParts Suite — Deploy ===" -ForegroundColor Cyan

# ---- Step 1: Build ----
if (-not $SkipBuild) {
    Write-Host "`n[1/4] Building production bundle..." -ForegroundColor Yellow
    Push-Location (Join-Path $PSScriptRoot "..")
    try {
        npx gulp bundle --ship
        if ($LASTEXITCODE -ne 0) { throw "gulp bundle --ship failed" }

        Write-Host "[2/4] Packaging .sppkg..." -ForegroundColor Yellow
        npx gulp package-solution --ship
        if ($LASTEXITCODE -ne 0) { throw "gulp package-solution --ship failed" }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "[1-2/4] Skipping build (--SkipBuild)" -ForegroundColor DarkGray
}

# ---- Verify .sppkg exists ----
if (-not (Test-Path $sppkgPath)) {
    throw "Package not found at $sppkgPath. Run without -SkipBuild."
}
$sizeKB = [math]::Round((Get-Item $sppkgPath).Length / 1KB, 1)
Write-Host "`n  Package: $sppkgPath ($sizeKB KB)" -ForegroundColor Green

# ---- Step 2: Upload ----
Write-Host "`n[3/4] Uploading to App Catalog..." -ForegroundColor Yellow
m365 spo app add --filePath $sppkgPath --appCatalogUrl $AppCatalogUrl --overwrite
if ($LASTEXITCODE -ne 0) { throw "Upload failed. Are you logged in? Run: m365 login" }

# ---- Step 3: Deploy ----
if (-not $SkipDeploy) {
    Write-Host "[4/4] Deploying (making available to sites)..." -ForegroundColor Yellow
    m365 spo app deploy --name $sppkgName --appCatalogUrl $AppCatalogUrl --skipFeatureDeployment
    if ($LASTEXITCODE -ne 0) { throw "Deploy failed." }
    Write-Host "`n=== Deployed successfully! ===" -ForegroundColor Green
}
else {
    Write-Host "[4/4] Skipping deploy (--SkipDeploy)" -ForegroundColor DarkGray
    Write-Host "`n=== Uploaded (not deployed). ===" -ForegroundColor Yellow
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Go to SharePoint Admin Center > API Access" -ForegroundColor White
Write-Host "  2. Approve pending API permission requests" -ForegroundColor White
Write-Host "  3. Add web parts to your pages!" -ForegroundColor White
Write-Host ""
