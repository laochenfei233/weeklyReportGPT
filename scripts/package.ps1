# 项目打包脚本 (PowerShell版本)
param(
    [string]$OutputPath = "."
)

$PROJECT_NAME = "weeklyReportGPT"
$VERSION = "2.0.0"
$PACKAGE_NAME = "$PROJECT_NAME-v$VERSION"

Write-Host "📦 开始打包项目 $PACKAGE_NAME..." -ForegroundColor Green

# 创建临时目录
$TEMP_DIR = Join-Path $env:TEMP $PACKAGE_NAME
if (Test-Path $TEMP_DIR) {
    Remove-Item $TEMP_DIR -Recurse -Force
}
New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null

Write-Host "📁 复制项目文件..." -ForegroundColor Yellow

# 复制必要的文件和目录
$directories = @("components", "pages", "public", "styles", "utils", "scripts", "messages")
foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Copy-Item $dir -Destination $TEMP_DIR -Recurse -Force
        Write-Host "  ✓ 复制 $dir" -ForegroundColor Gray
    }
}

# 复制配置文件
$configFiles = @(
    "package.json", "next.config.js", "tailwind.config.js", 
    "tsconfig.json", ".eslintrc.json", "vercel.json"
)
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $TEMP_DIR -Force
        Write-Host "  ✓ 复制 $file" -ForegroundColor Gray
    }
}

# 复制环境和Docker文件
$dockerFiles = @(".env.example", "Dockerfile", ".dockerignore", "docker-compose.yml")
foreach ($file in $dockerFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $TEMP_DIR -Force
        Write-Host "  ✓ 复制 $file" -ForegroundColor Gray
    }
}

# 复制文档
$docFiles = @(
    "README.md", "CHANGELOG.md", "DOCKER_GUIDE.md", 
    "VERCEL_DEPLOYMENT.md", "USAGE_GUIDE.md", 
    "VOLCENGINE_SETUP.md", "DEBUG_GUIDE.md"
)
foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $TEMP_DIR -Force
        Write-Host "  ✓ 复制 $file" -ForegroundColor Gray
    }
}

# 创建部署说明
$deploymentContent = @"
# 部署说明

## 🚀 快速部署

### 1. Vercel 部署（推荐）
``````bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
vercel --prod

# 3. 配置环境变量
# 在 Vercel 仪表板中设置 OPENAI_API_KEY 等环境变量
``````

### 2. Docker 部署
``````bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 2. 启动服务
docker-compose up -d

# 3. 访问应用
# http://localhost:3000
``````

### 3. 本地开发
``````bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# http://localhost:3000
``````

## 📋 环境变量配置

必需变量：
- OPENAI_API_KEY: 你的 API 密钥

可选变量：
- OPENAI_API_BASE: API 基础 URL
- OPENAI_MODEL: 使用的模型
- NEXT_PUBLIC_USE_USER_KEY: 是否允许用户输入密钥

详细配置请参考 README.md 和相关文档。
"@

$deploymentContent | Out-File -FilePath (Join-Path $TEMP_DIR "DEPLOYMENT.md") -Encoding UTF8

Write-Host "🗜️  创建压缩包..." -ForegroundColor Yellow

# 创建压缩包
$zipPath = Join-Path $OutputPath "$PACKAGE_NAME.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# 使用.NET压缩
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($TEMP_DIR, $zipPath)

# 清理临时目录
Remove-Item $TEMP_DIR -Recurse -Force

# 获取文件大小
$fileSize = (Get-Item $zipPath).Length
$fileSizeMB = [math]::Round($fileSize / 1MB, 2)

Write-Host "✅ 打包完成！" -ForegroundColor Green
Write-Host "📦 压缩包: $zipPath" -ForegroundColor Cyan
Write-Host "📊 文件大小: $fileSizeMB MB" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎯 部署方法：" -ForegroundColor Yellow
Write-Host "1. 解压: Expand-Archive $PACKAGE_NAME.zip" -ForegroundColor White
Write-Host "2. 进入目录: cd $PACKAGE_NAME" -ForegroundColor White
Write-Host "3. 查看 DEPLOYMENT.md 了解部署方法" -ForegroundColor White
Write-Host ""
Write-Host "🐳 Docker Hub 发布：" -ForegroundColor Yellow
Write-Host "1. 解压项目" -ForegroundColor White
Write-Host "2. 运行: ./scripts/docker-build.sh" -ForegroundColor White
Write-Host "3. 按提示推送到 Docker Hub" -ForegroundColor White