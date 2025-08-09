#!/bin/bash

# 项目打包脚本
set -e

PROJECT_NAME="weeklyReportGPT"
VERSION="2.0.0"
PACKAGE_NAME="${PROJECT_NAME}-v${VERSION}"

echo "📦 开始打包项目 ${PACKAGE_NAME}..."

# 创建临时目录
TEMP_DIR="/tmp/${PACKAGE_NAME}"
rm -rf ${TEMP_DIR}
mkdir -p ${TEMP_DIR}

echo "📁 复制项目文件..."

# 复制必要的文件和目录
cp -r components ${TEMP_DIR}/
cp -r pages ${TEMP_DIR}/
cp -r public ${TEMP_DIR}/
cp -r styles ${TEMP_DIR}/
cp -r utils ${TEMP_DIR}/
cp -r scripts ${TEMP_DIR}/
cp -r messages ${TEMP_DIR}/

# 复制配置文件
cp package.json ${TEMP_DIR}/
cp next.config.js ${TEMP_DIR}/
cp tailwind.config.js ${TEMP_DIR}/
cp tsconfig.json ${TEMP_DIR}/
cp .eslintrc.json ${TEMP_DIR}/
cp vercel.json ${TEMP_DIR}/

# 复制环境和Docker文件
cp .env.example ${TEMP_DIR}/
cp Dockerfile ${TEMP_DIR}/
cp .dockerignore ${TEMP_DIR}/
cp docker-compose.yml ${TEMP_DIR}/

# 复制文档
cp README.md ${TEMP_DIR}/
cp CHANGELOG.md ${TEMP_DIR}/
cp DOCKER_GUIDE.md ${TEMP_DIR}/
cp VERCEL_DEPLOYMENT.md ${TEMP_DIR}/
cp USAGE_GUIDE.md ${TEMP_DIR}/
cp VOLCENGINE_SETUP.md ${TEMP_DIR}/
cp DEBUG_GUIDE.md ${TEMP_DIR}/

# 创建部署说明
cat > ${TEMP_DIR}/DEPLOYMENT.md << 'EOF'
# 部署说明

## 🚀 快速部署

### 1. Vercel 部署（推荐）
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
vercel --prod

# 3. 配置环境变量
# 在 Vercel 仪表板中设置 OPENAI_API_KEY 等环境变量
```

### 2. Docker 部署
```bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 2. 启动服务
docker-compose up -d

# 3. 访问应用
# http://localhost:3000
```

### 3. 本地开发
```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# http://localhost:3000
```

## 📋 环境变量配置

必需变量：
- OPENAI_API_KEY: 你的 API 密钥

可选变量：
- OPENAI_API_BASE: API 基础 URL
- OPENAI_MODEL: 使用的模型
- NEXT_PUBLIC_USE_USER_KEY: 是否允许用户输入密钥

详细配置请参考 README.md 和相关文档。
EOF

# 设置脚本执行权限
chmod +x ${TEMP_DIR}/scripts/*.sh

echo "🗜️  创建压缩包..."

# 创建压缩包
cd /tmp
tar -czf ${PACKAGE_NAME}.tar.gz ${PACKAGE_NAME}/

# 移动到当前目录
mv ${PACKAGE_NAME}.tar.gz ./

# 清理临时目录
rm -rf ${TEMP_DIR}

echo "✅ 打包完成！"
echo "📦 压缩包: ${PACKAGE_NAME}.tar.gz"
echo "📊 文件大小: $(du -h ${PACKAGE_NAME}.tar.gz | cut -f1)"

echo ""
echo "🎯 部署方法："
echo "1. 解压: tar -xzf ${PACKAGE_NAME}.tar.gz"
echo "2. 进入目录: cd ${PACKAGE_NAME}"
echo "3. 查看 DEPLOYMENT.md 了解部署方法"
echo ""
echo "🐳 Docker Hub 发布："
echo "1. 解压项目"
echo "2. 运行: ./scripts/docker-build.sh"
echo "3. 按提示推送到 Docker Hub"