#!/bin/bash

# Docker构建和发布脚本
set -e

# 配置变量
IMAGE_NAME="weekly-report-gpt"
VERSION="2.0.0"
DOCKER_USERNAME="your-dockerhub-username"  # 请替换为实际的Docker Hub用户名

echo "🐳 开始构建Docker镜像..."

# 构建镜像
docker build -t ${IMAGE_NAME}:${VERSION} .
docker build -t ${IMAGE_NAME}:latest .

echo "✅ Docker镜像构建完成"

# 标记镜像用于推送到Docker Hub
docker tag ${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
docker tag ${IMAGE_NAME}:latest ${DOCKER_USERNAME}/${IMAGE_NAME}:latest

echo "🏷️  镜像标记完成"

# 推送到Docker Hub（需要先登录）
echo "📤 推送镜像到Docker Hub..."
echo "请确保已经登录Docker Hub: docker login"

read -p "是否要推送到Docker Hub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    echo "✅ 镜像推送完成"
    echo "📋 使用方法:"
    echo "   docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
    echo "   docker run -p 3000:3000 -e OPENAI_API_KEY=your-key ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
else
    echo "⏭️  跳过推送到Docker Hub"
fi

echo "🎉 Docker构建流程完成！"
echo ""
echo "本地使用方法:"
echo "1. 使用docker-compose: docker-compose up -d"
echo "2. 直接运行: docker run -p 3000:3000 -e OPENAI_API_KEY=your-key ${IMAGE_NAME}:latest"