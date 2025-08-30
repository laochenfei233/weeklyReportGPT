# 🔧 环境配置指南

## 📋 环境变量详解

### 必需变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `OPENAI_API_KEY` | API密钥，支持多个密钥用逗号分隔 | `sk-...` |

### 可选变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `OPENAI_API_BASE` | `https://api.openai.com/v1` | API基础URL |
| `OPENAI_MODEL` | `gpt-3.5-turbo` | 使用的模型 |
| `NEXT_PUBLIC_USE_USER_KEY` | `false` | 是否允许用户自定义API密钥 |
| `JWT_SECRET` | 自动生成 | JWT签名密钥 |
| `SESSION_DURATION_DAYS` | `14` | 会话持续时间（天） |
| `REQUEST_TIMEOUT` | `30000` | 请求超时时间（毫秒） |
| `MAX_TOKENS` | `2000` | 最大生成token数 |

## 🌐 支持的API源配置

### OpenAI 官方
```env
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

**支持的模型:**
- `gpt-3.5-turbo` (推荐，速度快)
- `gpt-4` (质量高，速度较慢)
- `gpt-4-turbo`
- `gpt-4o`

### DeepSeek
```env
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_API_BASE=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

**支持的模型:**
- `deepseek-chat` (通用对话)
- `deepseek-coder` (代码生成)

### Moonshot (月之暗面)
```env
OPENAI_API_KEY=sk-your-moonshot-key
OPENAI_API_BASE=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

**支持的模型:**
- `moonshot-v1-8k` (8K上下文)
- `moonshot-v1-32k` (32K上下文)
- `moonshot-v1-128k` (128K上下文)

### 智谱AI (GLM)
```env
OPENAI_API_KEY=your-zhipu-key
OPENAI_API_BASE=https://open.bigmodel.cn/api/paas/v4
OPENAI_MODEL=glm-4
```

**支持的模型:**
- `glm-4` (最新版本)
- `glm-3-turbo` (快速版本)

### 自定义API源
```env
OPENAI_API_KEY=your-custom-key
OPENAI_API_BASE=https://your-custom-api.com/v1
OPENAI_MODEL=your-custom-model
```

## 🔐 JWT密钥配置

JWT密钥用于管理员认证系统，有多种配置方式：

### 方式1: 自动生成（推荐）
部署后访问 `https://your-app.vercel.app/auto-init` 自动生成并配置

### 方式2: 手动生成
访问 `https://your-app.vercel.app/generate-jwt` 手动生成密钥

### 方式3: 命令行生成
```bash
# 使用项目脚本
npm run generate-jwt-secret

# 使用Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 使用OpenSSL
openssl rand -hex 64
```

### 方式4: 在线生成
访问 https://generate-secret.vercel.app/64 生成64字节随机密钥

## 🔧 高级配置

### 多API密钥轮换
```env
# 支持多个密钥，用逗号分隔
OPENAI_API_KEY=sk-key1,sk-key2,sk-key3
```

### 性能调优
```env
# 请求超时（毫秒）
REQUEST_TIMEOUT=30000

# 最大生成token数
MAX_TOKENS=2000

# 会话持续时间（天）
SESSION_DURATION_DAYS=14
```

### 用户模式配置
```env
# 允许用户输入自己的API密钥
NEXT_PUBLIC_USE_USER_KEY=true

# 禁用用户输入，仅使用系统密钥
NEXT_PUBLIC_USE_USER_KEY=false
```

## 📱 平台特定配置

### Vercel
在 Vercel Dashboard → Settings → Environment Variables 中配置：

1. 点击 "Add New"
2. 输入变量名和值
3. 选择环境 (Production, Preview, Development)
4. 点击 "Save"

### 本地开发
创建 `.env` 文件：
```bash
cp .env.example .env
# 编辑 .env 文件
```



## 🔍 配置验证

### 健康检查
访问 `/api/health` 检查配置状态：
```json
{
  "status": "ok",
  "config": {
    "hasApiKey": true,
    "apiBase": "https://api.openai.com/v1",
    "model": "gpt-3.5-turbo",
    "useUserKey": false
  }
}
```

### 调试页面
访问 `/debug` 进行完整的系统诊断：
- 环境变量检查
- API连接测试
- JWT配置验证
- 功能测试

## ⚠️ 安全注意事项

1. **API密钥安全**
   - 不要在代码中硬编码API密钥
   - 使用环境变量存储敏感信息
   - 定期轮换API密钥

2. **JWT密钥安全**
   - 生产环境必须使用强随机密钥
   - 不要使用默认或简单的密钥
   - 密钥泄露时立即更换

3. **环境隔离**
   - 开发、测试、生产环境使用不同的密钥
   - 不要在公共仓库中提交 `.env` 文件

## 🆘 故障排除

### 常见配置问题

**1. API密钥无效**
```
Error: Invalid API key
```
- 检查密钥格式是否正确
- 确认密钥有效且有余额
- 验证API源配置是否匹配

**2. JWT密钥未配置**
```
Error: JWT secret not configured
```
- 访问 `/auto-init` 自动配置
- 或手动设置 `JWT_SECRET` 环境变量

**3. 超时错误**
```
Error: Request timeout
```
- 增加 `REQUEST_TIMEOUT` 值
- 减少 `MAX_TOKENS` 值
- 选择更快的API源

### 配置检查清单

- [ ] `OPENAI_API_KEY` 已设置且有效
- [ ] `OPENAI_API_BASE` 与API源匹配
- [ ] `OPENAI_MODEL` 在API源中可用
- [ ] `JWT_SECRET` 已配置（如使用认证）
- [ ] 超时和token限制合理设置
- [ ] 环境变量在部署平台正确配置

---

*正确的环境配置是应用正常运行的基础。*