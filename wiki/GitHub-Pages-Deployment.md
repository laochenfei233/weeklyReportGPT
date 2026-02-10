# 🚀 GitHub Pages 部署指南

本项目已完美支持部署到 GitHub Pages，享受免费静态托管！

## 📋 部署前准备

### 1. Fork 项目

```bash
# 在GitHub上Fork本项目
# 访问 https://github.com/laochenfei233/weeklyReportGPT
# 点击右上角 Fork 按钮
```

### 2. 准备 API 密钥

GitHub Pages 部署使用**客户端 API 调用模式**，你需要：
- OpenAI API Key（或其他兼容的 AI 服务）
- 或 DeepSeek API Key
- 或 Moonshot AI API Key
- 或 智谱AI API Key

> 💡 **提示**: 用户在使用时会直接输入自己的 API 密钥，无需在部署时配置。

## 🔧 部署步骤

### 步骤 1：启用 GitHub Pages

1. 进入你 Fork 的仓库
2. 点击 **「Settings」** 标签
3. 在左侧菜单中找到 **「Pages」**
4. 在 **「Source」** 部分：
   - **Branch**: 选择 `main`
   - **Folder**: 选择 `/(root)`
   - 点击 **「Save」**

### 步骤 2：配置 GitHub Actions

项目已包含自动构建的 GitHub Actions 配置文件。你也可以手动配置：

1. 在仓库根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 步骤 3：等待部署完成

1. 进入 **「Actions」** 标签
2. 等待工作流运行完成（约 2-3 分钟）
3. 部署成功后，访问你的 GitHub Pages 站点

## 🔗 访问你的站点

GitHub Pages 站点地址格式：
```
https://<username>.github.io/<repository-name>
```

例如：
```
https://your-username.github.io/weeklyReportGPT
```

## ⚙️ 自定义域名（可选）

### 添加自定义域名

1. 进入 **「Settings」** → **「Pages」**
2. 在 **「Custom domain」** 输入你的域名
3. 点击 **「Save」**
4. 按照提示配置 DNS 记录

### 配置 www 跳转

在 `public/` 目录创建 `CNAME` 文件：
```
your-domain.com
```

## 🔑 使用说明

### 首次使用

1. 打开部署好的网站
2. 点击右上角 **⚙️ 设置** 图标
3. 在 **API 配置** 中选择你的 API 提供商
4. 输入你的 API 密钥
5. 保存设置

### 支持的 API 提供商

| 提供商 | 端点 URL | 默认模型 |
|--------|----------|----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-3.5-turbo` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| Moonshot AI | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` |
| 智谱AI | `https://open.bigmodel.cn/api/paas/v4` | `glm-4` |
| 自定义 | 任意 OpenAI 兼容端点 | 任意 |

### API 密钥格式

| 提供商 | 密钥格式 |
|--------|----------|
| OpenAI | `sk-xxxxxxxxxxxxxxxxxxxx` |
| DeepSeek | `sk-xxxxxxxxxxxxxxxxxxxx` |
| Moonshot AI | `sk-xxxxxxxxxxxxxxxxxxxx` |
| 智谱AI | `xxxxxxxxxxxxxxxxxxxx` (16位以上) |

## 📊 功能对比

| 功能 | GitHub Pages | Vercel | Cloudflare Pages |
|------|--------------|--------|------------------|
| 免费托管 | ✅ | ✅ | ✅ |
| 全球 CDN | ✅ | ✅ | ✅ |
| 免费流量 | ✅ | ❌ 有限 | ✅ 无限 |
| 自动部署 | ✅ | ✅ | ✅ |
| 无服务器函数 | ❌ | ✅ | ❌ |
| 客户端 API | ✅ | ✅ | ✅ |
| 自定义域名 | ✅ | ✅ | ✅ |
| SSL 证书 | ✅ 自动 | ✅ 自动 | ✅ 自动 |

## 🔄 更新部署

### 自动更新

当你的 GitHub 仓库有新的提交到 `main` 分支时，GitHub Actions 会自动重新部署。

### 手动触发部署

1. 进入 **「Actions」** 标签
2. 选择 **「Deploy to GitHub Pages」** 工作流
3. 点击 **「Run workflow」**
4. 选择分支并点击 **「Run workflow」**

## 🆘 常见问题

### Q1: 部署失败，提示权限错误？

确保在仓库设置中启用了 GitHub Pages：
1. Settings → Pages
2. 确认 Source 设置正确
3. 确认 GitHub Actions 有权限访问仓库

### Q2: 网站显示 404？

可能的原因：
- 部署还没完成，等待几分钟
- 检查 Actions 工作流是否成功
- 确认分支名称正确

### Q3: 样式文件丢失？

检查 `next.config.js` 中 `trailingSlash` 设置为 `true`：
```javascript
trailingSlash: true,
```

### Q4: 支持 HTTPS 吗？

是的！GitHub Pages 自动提供 SSL/TLS 证书。

### Q5: 可以使用自定义域名吗？

可以！支持 apex 域名和子域名。

### Q6: 部署速度慢？

GitHub Pages 部署通常需要 1-5 分钟。如果长时间无响应，检查 Actions 日志。

### Q7: 支持多语言吗？

支持！项目内置中英文支持，访问时自动检测浏览器语言。

## 📁 项目文件说明

```
weeklyReportGPT/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署配置
├── public/
│   ├── .nojekyll           # 禁用 Jekyll 处理
│   └── _redirects          # 路由重定向配置（可选）
├── out/                    # 构建输出目录
└── next.config.js          # Next.js 配置
```

## 🔒 隐私与安全

- 所有 API 调用直接从用户浏览器发送到 AI 服务商
- 项目不会存储你的 API 密钥
- 数据不会经过任何中间服务器
- GitHub Pages 不支持服务端代码，完全静态

## 📝 注意事项

1. **API 密钥安全**: 不要将 API 密钥提交到公开的代码仓库
2. **使用限制**: 各 AI 服务商有不同的速率限制
3. **部署频率**: GitHub Actions 有每日部署次数限制
4. **仓库可见性**: 建议将仓库设为 Private 以提高安全性

## ⚡ 快速部署（极简版）

如果你只想快速部署，不使用 GitHub Actions：

1. Fork 本项目
2. 在本地运行：
   ```bash
   npm install
   npm run build
   ```
3. 将 `out` 目录内容上传到 `gh-pages` 分支
4. 启用 GitHub Pages 并选择 `gh-pages` 分支

## 📞 获取帮助

- [GitHub Issues](https://github.com/laochenfei233/weeklyReportGPT/issues)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [项目 Wiki](../../wiki)

---

**部署愉快！🎉**
