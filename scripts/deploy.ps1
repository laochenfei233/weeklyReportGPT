# Weekly Report Deployment Script for Windows
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
    exit 1
}

# Type check
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
npm run type-check

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type check failed." -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "🏗️  Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "🎉 Ready for deployment to Vercel!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy to Vercel:" -ForegroundColor Cyan
    Write-Host "1. Install Vercel CLI: npm i -g vercel" -ForegroundColor White
    Write-Host "2. Run: vercel --prod" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use the Vercel dashboard to deploy from your Git repository." -ForegroundColor White
} else {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}