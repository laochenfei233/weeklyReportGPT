# Vercel 部署指南

## 🚀 部署步骤

### 1. 准备项目
确保项目在本地构建成功：
```bash
npm run build
```

### 2. 推送到 GitHub
将项目推送到 GitHub 仓库。

### 3. 连接 Vercel
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 点击 "Deploy"

### 4. 配置数据库
在 Vercel 项目中添加 Postgres 数据库：

1. 进入项目设置
2. 点击 "Storage" 标签
3. 点击 "Create Database"
4. 选择 "Postgres"
5. 输入数据库名称
6. 点击 "Create"

数据库连接信息会自动添加到环境变量中。

### 5. 配置环境变量
在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量
```env
# JWT密钥（生产环境请使用强密钥）
JWT_SECRET=your-super-secret-jwt-key-for-production

# 数据库初始化密钥
DB_INIT_KEY=your-database-init-key

# OpenAI API配置
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

# 用户密钥模式（可选）
NEXT_PUBLIC_USE_USER_KEY=false
```

#### 可选的邮箱配置（生产环境推荐）
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com
```

### 6. 初始化数据库
部署完成后：

1. 访问 `https://your-app.vercel.app/init-db`
2. 点击 "初始化数据库" 按钮
3. 等待初始化完成

### 7. 测试功能
使用默认管理员账户测试：
- 邮箱：`admin@example.com`
- 用户名：`admin`
- 密码：`admin123`

## 🔧 生产环境配置

### 邮箱服务配置
如果需要真实的邮箱发送功能，需要：

1. 配置 SMTP 环境变量
2. 取消注释 `lib/email.ts` 中的生产环境代码
3. 重新部署

### 安全配置
1. **JWT_SECRET**: 使用强随机密钥
2. **DB_INIT_KEY**: 使用复杂密钥
3. **SMTP 密码**: 使用应用专用密码

### 域名配置
在 Vercel 项目设置中可以：
1. 添加自定义域名
2. 配置 SSL 证书
3. 设置重定向规则

## 🐛 常见问题

### Q: 构建失败 - 找不到导出的函数
A: 这通常是缓存问题，解决方案：
1. 清除 Vercel 构建缓存
2. 重新部署
3. 检查函数导出语法

### Q: 数据库连接失败
A: 确保：
1. Postgres 数据库已创建
2. 环境变量自动配置正确
3. 网络连接正常

### Q: 邮箱验证码发送失败
A: 开发环境中验证码会输出到日志，生产环境需要配置 SMTP。

### Q: 登录失败
A: 检查：
1. 数据库是否已初始化
2. 管理员账户是否创建成功
3. JWT_SECRET 是否配置

## 📊 监控和日志

### Vercel 功能
- **实时日志**: 查看函数执行日志
- **性能监控**: 监控响应时间
- **错误追踪**: 自动错误报告

### 自定义监控
可以集成：
- Sentry（错误监控）
- LogRocket（用户会话录制）
- Google Analytics（用户行为分析）

## 🔄 持续部署

### 自动部署
Vercel 会自动：
1. 监听 GitHub 推送
2. 运行构建流程
3. 部署到生产环境

### 分支部署
- `main` 分支 → 生产环境
- 其他分支 → 预览环境

## 📈 性能优化

### 已实现的优化
- ✅ 静态页面生成
- ✅ 代码分割
- ✅ 图片优化
- ✅ 缓存策略

### 进一步优化
- 启用 Edge Functions
- 配置 CDN
- 数据库连接池
- Redis 缓存

---

现在你的项目已经准备好部署到 Vercel 了！🚀