# [Weekly Report](https://weeklyreport.avemaria.fun/)

## [English](README_EN.md)

简单描述工作内容，帮你生成完整周报

[![Weekly Report](./public/screenshot.jpg)](https://weeklyreport.avemaria.fun/zh)

## ✨ 新特性

- 🎨 **用户设置**: 个性化字体大小、回答风格、语言和自定义模型配置
- 🔄 **多API源支持**: 支持 OpenAI、DeepSeek、Moonshot、智谱AI 等多种 API 源
- 🌐 **环境变量配置**: 通过环境变量灵活配置 API 源和模型
- 🚀 **Node.js 22 支持**: 升级到最新的依赖和 Node.js 版本
- ☁️ **Vercel 优化**: 保持完美的 Vercel 部署兼容性
- 🛡️ **错误处理**: 增强的错误处理和超时控制
- 📝 **TypeScript**: 完整的 TypeScript 支持
- 🔧 **调试工具**: 内置系统诊断和健康检查功能

## 🔧 支持的API源

| 提供商 | 基础URL | 模型示例 | 说明 |
|--------|---------|----------|------|
| OpenAI | `https://api.openai.com/v1` | `gpt-3.5-turbo`, `gpt-4` | 官方 OpenAI API |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat`, `deepseek-coder` | DeepSeek AI |
| Moonshot | `https://api.moonshot.cn/v1` | `moonshot-v1-8k`, `moonshot-v1-32k` | 月之暗面 |
| 智谱AI | `https://open.bigmodel.cn/api/paas/v4` | `glm-4`, `glm-3-turbo` | 智谱 GLM |
| 自定义 | 自定义URL | 自定义模型 | 任何兼容 OpenAI 格式的API |

## 🚀 快速开始

### 系统要求

- **Node.js**: 18.0.0 - 22.x （推荐使用最新的 LTS 版本）
- **npm**: 6.0.0 或更高版本
- **操作系统**: Windows, macOS, Linux

### 本地运行

1. **克隆项目**
```bash
git clone https://github.com/laochenfei233/weeklyReportGPT.git
cd weeklyReportGPT
```

2. **安装依赖**
```bash
npm install
```

3. **快速设置（推荐）**
```bash
npm run setup
```

或者手动配置：

4. **配置环境变量**
```bash
cp .env.example .env
```

5. **生成 JWT 密钥（如果使用管理员功能）**
```bash
npm run generate-jwt-secret
```

6. **编辑环境变量**

编辑 `.env` 文件，配置你的 API 源：

```bash
# OpenAI (默认)
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

# 或者使用 DeepSeek
# OPENAI_API_KEY=sk-your-deepseek-api-key
# OPENAI_API_BASE=https://api.deepseek.com/v1
# OPENAI_MODEL=deepseek-chat

# 其他配置
NEXT_PUBLIC_USE_USER_KEY=false
REQUEST_TIMEOUT=30000
MAX_TOKENS=2000

# 认证配置（如果使用管理员系统）
JWT_SECRET=生成的密钥粘贴到这里
SESSION_DURATION_DAYS=14
```

7. **启动开发服务器**
```bash
npm run dev
```

打开 `http://localhost:3000`

### 🔒 环境变量安全提醒

- `.env` 文件已在 `.gitignore` 中，不会被提交到 Git
- 请勿将包含真实 API 密钥的环境变量文件分享给他人
- 生产环境部署时，在平台的环境变量设置中配置，而不是代码中


## ☁️ 部署到 Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laochenfei233/weeklyReportGPT&env=OPENAI_API_KEY,OPENAI_API_BASE,OPENAI_MODEL,NEXT_PUBLIC_USE_USER_KEY&project-name=weeklyReportGPT&repo-name=weeklyReportGPT)

### 手动部署

1. Fork 这个项目到你的 GitHub
2. 在 [Vercel](https://vercel.com) 中导入你的项目
3. 在 Vercel 项目设置中配置环境变量：

**必需的环境变量：**
- `OPENAI_API_KEY` = `your-api-key-here`
- `NEXT_PUBLIC_USE_USER_KEY` = `false`

**JWT密钥配置（3种方式）：**
- 🚀 **自动生成**：部署后访问 `https://your-app.vercel.app/auto-init` 自动生成
- 🎲 **手动生成**：访问 `https://your-app.vercel.app/generate-jwt` 手动生成
- ⚙️ **自定义设置**：手动设置 `JWT_SECRET` 环境变量

📋 **详细部署指南**: 查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**可选的环境变量：**
- `OPENAI_API_BASE` = `https://api.openai.com/v1`
- `OPENAI_MODEL` = `gpt-3.5-turbo`
- `REQUEST_TIMEOUT` = `30000`
- `MAX_TOKENS` = `2000`
- `SESSION_DURATION_DAYS` = `14`

### 配置步骤

1. 在 Vercel 项目页面，点击 **Settings** 标签
2. 在左侧菜单中选择 **Environment Variables**
3. 添加上述环境变量，每个变量分别添加：
   - **Name**: 变量名（如 `OPENAI_API_KEY`）
   - **Value**: 变量值（如你的 API 密钥）
   - **Environment**: 选择 `Production`, `Preview`, `Development`（建议全选）
4. 点击 **Save** 保存
5. 重新部署项目



## 🔍 故障排除

如果遇到"服务繁忙，请稍后再试"错误：

1. **使用调试页面**: 访问 `https://your-domain.vercel.app/debug` 进行系统诊断
2. **检查健康状态**: 访问 `https://your-domain.vercel.app/api/health` 查看服务状态
3. **检查环境变量**: 确保在 Vercel Dashboard 中正确设置了 `OPENAI_API_KEY`
4. **验证API密钥**: 确保API密钥有效且有足够余额
5. **查看Vercel日志**: 在Vercel项目页面查看Functions日志

### 快速修复

推荐的环境变量配置：
```bash
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
NEXT_PUBLIC_USE_USER_KEY=false
```

### 调试工具
- **调试页面**: `/debug` - 完整的系统诊断
- **健康检查**: `/api/health` - 服务状态监控
- **环境检查**: 自动检测配置问题

## 🔧 配置说明

### 环境变量详解

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `OPENAI_API_KEY` | 是* | - | API 密钥，支持逗号分隔多个密钥 |
| `OPENAI_API_BASE` | 否 | `https://api.openai.com/v1` | API 基础URL |
| `OPENAI_MODEL` | 否 | `gpt-3.5-turbo` | 使用的模型名称 |
| `NEXT_PUBLIC_USE_USER_KEY` | 否 | `false` | 是否允许用户输入自己的API密钥 |
| `REQUEST_TIMEOUT` | 否 | `30000` | 请求超时时间（毫秒） |
| `MAX_TOKENS` | 否 | `2000` | 最大生成token数 |
| `SESSION_DURATION_DAYS` | 否 | `14` | 用户会话持续时间（天） |
| `JWT_SECRET` | 否 | - | JWT密钥，生产环境必须设置 |

*当 `NEXT_PUBLIC_USE_USER_KEY=true` 时不必需

### API源配置示例

**OpenAI 官方：**
```bash
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

**DeepSeek：**
```bash
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_API_BASE=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

**Moonshot：**
```bash
OPENAI_API_KEY=sk-your-moonshot-key
OPENAI_API_BASE=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

**智谱AI：**
```bash
OPENAI_API_KEY=your-zhipu-key
OPENAI_API_BASE=https://open.bigmodel.cn/api/paas/v4
OPENAI_MODEL=glm-4
```

### 管理员认证配置

如果你的部署包含管理员认证系统，需要额外配置以下环境变量：

```bash
# 认证配置
JWT_SECRET=your-jwt-secret-key-change-in-production  # JWT密钥，生产环境必须设置
SESSION_DURATION_DAYS=14                             # 管理员会话持续时间（天）
```

**如何生成安全的 JWT_SECRET：**

方法1 - 使用项目脚本（推荐）：
```bash
npm run generate-jwt-secret
```

方法2 - 直接使用脚本：
```bash
node scripts/generate-jwt-secret.js
```

方法3 - 使用 Node.js：
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

方法4 - 使用 OpenSSL：
```bash
openssl rand -hex 64
```

方法5 - Vercel网页生成（推荐）：
访问你的部署地址 `https://your-app.vercel.app/generate-jwt` 使用网页生成器

方法6 - Vercel API生成：
访问你的部署地址 `https://your-app.vercel.app/api/generate-jwt-secret` 生成密钥

方法7 - 在线生成器：
访问 https://generate-secret.vercel.app/64 生成64字节的随机密钥

**配置步骤：**

**本地开发：**
1. 运行 `npm run generate-jwt-secret` 生成密钥
2. 复制生成的密钥
3. 在 `.env` 文件中替换 `JWT_SECRET=your-jwt-secret-key-change-in-production`

**Vercel部署：**
1. 访问 `https://your-app.vercel.app/generate-jwt` 使用网页生成器
2. 点击"生成新密钥"按钮
3. 复制生成的密钥
4. 在 Vercel Dashboard → Settings → Environment Variables 中添加
5. 变量名：`JWT_SECRET`，值：复制的密钥
6. 重新部署项目

**管理员认证说明：**
- 使用验证码登录，无需数据库
- 验证码显示在服务器日志中（Vercel Functions 日志）
- `JWT_SECRET`: JWT token 签名密钥，**生产环境必须设置为安全的随机字符串**
- `SESSION_DURATION_DAYS`: 控制管理员登录后的会话持续时间
- 默认值为14天，可以根据需要调整（如7天、30天等）
- 修改后需要重启应用才能生效

**验证码登录流程：**
1. 点击"管理"按钮
2. 点击"生成验证码"
3. 在 Vercel Dashboard → Functions → 日志中查看6位验证码
4. 输入验证码完成登录

## 📖 使用指南

### 基本使用
1. **访问网站**：打开部署后的网站地址
2. **输入内容**：在文本框中简单描述你的工作内容
3. **生成周报**：点击生成按钮，等待AI生成完整的周报
4. **复制使用**：点击复制按钮，将生成的周报复制到需要的地方

### 输入技巧
- **具体描述**：提供具体的工作内容，而不是泛泛而谈
- **关键信息**：包含项目名称、完成的功能、解决的问题等
- **数据支撑**：如果有具体的数据或成果，可以一并提及

### 示例输入
```
本周完成了用户管理系统的开发，包括用户注册、登录、权限管理等功能。
修复了订单系统中的3个bug，提升了系统稳定性。
参与了2次技术评审会议，协助制定了新项目的技术方案。
完成了代码review工作，审查了约500行代码。
```

### 用户设置
访问 `/settings` 页面可以个性化配置：
- **显示设置**: 字体大小、界面语言
- **回答风格**: 专业正式、轻松随意、详细完整、简洁明了
- **自定义配置**: 使用自己的API密钥和模型

### 调试功能
如果遇到问题，可以访问 `/debug` 页面进行系统诊断：
- 检查环境变量配置
- 测试API连接状态  
- 验证周报生成功能

### 健康检查
访问 `/api/health` 可以查看服务状态和配置信息。

## 🔒 隐私保护

- 您的输入内容不会被永久存储
- 仅在生成周报时临时处理数据
- 支持使用自己的API密钥增强隐私控制
- 详细信息请查看 [隐私政策](./privacy.md)

<!-- https://www.seotraininglondon.org/gpt3-business-email-generator/ -->

## 一些数据
### 2023-03-06
![Weekly Report](./public/2023-03-06-data.jpg)

### 2023-04-19
![Weekly Report](./public/2023-04-19-data.png)


## 感谢

受 [TwtterBio](https://github.com/Nutlope/twitterbio) 和 [chat-simplifier](https://github.com/zhengbangbo/chat-simplifier) 启发.


