# Docker 部署和上传 Docker Hub 完整指南

## 🎯 目标
将 WeeklyReportGPT 项目构建为 Docker 镜像并上传到 Docker Hub

## 📋 前提条件

### 1. 安装 Docker
- Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- 确保 Docker 服务正在运行

### 2. Docker Hub 账号
- 注册地址: https://hub.docker.com/
- 记住你的用户名（例如：`your-username`）

## 🚀 部署步骤

### 步骤 1: 登录 Docker Hub

```bash
docker login
```

输入你的 Docker Hub 用户名和密码。

### 步骤 2: 构建 Docker 镜像

在项目根目录执行：

```bash
# 构建镜像（替换 your-username 为你的 Docker Hub 用户名）
docker build -t your-username/weekly-report-gpt:2.0.0 .
docker build -t your-username/weekly-report-gpt:latest .
```

**示例**（假设用户名是 `johndoe`）：
```bash
docker build -t johndoe/weekly-report-gpt:2.0.0 .
docker build -t johndoe/weekly-report-gpt:latest .
```

### 步骤 3: 测试镜像

在推送之前，先本地测试镜像是否正常工作：

```bash
# 运行容器测试
docker run -d \
  --name weekly-report-test \
  -p 3000:3000 \
  -e OPENAI_API_KEY=your-test-key \
  your-username/weekly-report-gpt:latestc

# 检查容器状态
docker ps

# 访问 http://localhost:3000 测试

# 停止并删除测试容器
docker stop weekly-report-test
docker rm weekly-report-test
```

### 步骤 4: 推送到 Docker Hub

```bash
# 推送版本标签
docker push your-username/weekly-report-gpt:2.0.0

# 推送 latest 标签
docker push your-username/weekly-report-gpt:latest
```

### 步骤 5: 验证上传

1. 访问 https://hub.docker.com/
2. 登录你的账号
3. 查看 Repositories，应该能看到 `weekly-report-gpt`

## 🛠️ 使用自动化脚本

我们提供了自动化脚本来简化流程：

### Windows PowerShell 脚本

```powershell
# 运行自动化脚本
.\scripts\docker-build-and-push.ps1 -Username "your-username"
```

### Linux/Mac Bash 脚本

```bash
# 给脚本执行权限
chmod +x scripts/docker-build-and-push.sh

# 运行脚本
./scripts/docker-build-and-push.sh your-username
```

## 📦 用户如何使用你的镜像

用户可以通过以下方式使用你上传的镜像：

### 直接运行

```bash
docker run -d \
  --name weekly-report \
  -p 3000:3000 \
  -e OPENAI_API_KEY=their-api-key \
  -e OPENAI_API_BASE=https://api.openai.com/v1 \
  -e OPENAI_MODEL=gpt-3.5-turbo \
  your-username/weekly-report-gpt:latest
```

### 使用 Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  weekly-report:
    image: your-username/weekly-report-gpt:latest
    container_name: weekly-report
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=your-api-key
      - OPENAI_API_BASE=https://api.openai.com/v1
      - OPENAI_MODEL=gpt-3.5-turbo
      - NEXT_PUBLIC_USE_USER_KEY=false
    restart: unless-stopped
```

然后运行：
```bash
docker-compose up -d
```

## 🔧 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理 Docker 缓存
   docker system prune -a
   
   # 重新构建
   docker build --no-cache -t your-username/weekly-report-gpt:latest .
   ```

2. **推送失败**
   ```bash
   # 重新登录
   docker logout
   docker login
   
   # 检查镜像名称格式
   docker images | grep weekly-report
   ```

3. **权限问题**
   ```bash
   # 确保已登录 Docker Hub
   docker login
   
   # 检查用户名是否正确
   docker info | grep Username
   ```

### 调试命令

```bash
# 查看本地镜像
docker images

# 查看构建历史
docker history your-username/weekly-report-gpt:latest

# 进入容器调试
docker run -it --rm your-username/weekly-report-gpt:latest /bin/sh

# 查看容器日志
docker logs container-name
```

## 📊 镜像信息

- **基础镜像**: node:18-alpine
- **暴露端口**: 3000
- **工作目录**: /app
- **用户**: nextjs (非root用户)
- **健康检查**: 内置健康检查端点

## 🔒 安全建议

1. **不要在镜像中包含敏感信息**
2. **使用环境变量传递配置**
3. **定期更新基础镜像**
4. **使用非root用户运行**

## 📈 最佳实践

1. **使用多阶段构建**减少镜像大小
2. **使用 .dockerignore**排除不必要文件
3. **标记版本号**便于管理c
4. **添加健康检查**确保服务可用性

---

**完成后，你的镜像将可以通过以下命令使用：**

```bash
docker pull your-username/weekly-report-gpt:latest
docker run -p 3000:3000 -e OPENAI_API_KEY=your-key your-username/weekly-report-gpt:latest
```c