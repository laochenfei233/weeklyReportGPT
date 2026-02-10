# 🚀 Cloudflare Pages 部署指南

本项目已完美支持部署到 Cloudflare Pages，享受全球 CDN 加速和无限免费流量！

## 📋 部署前准备

### 1. Fork 项目

```bash
# 在GitHub上Fork本项目
# 访问 https://github.com/laochenfei233/weeklyReportGPT
# 点击右上角 Fork 按钮
```

### 2. 准备 API 密钥

Cloudflare Pages 部署使用**客户端 API 调用模式**，你需要：
- OpenAI API Key（或其他兼容的 AI 服务）
- 或 DeepSeek API Key
- 或 Moonshot AI API Key
- 或 智谱AI API Key

> 💡 **提示**: 用户在使用时会直接输入自己的 API 密钥，无需在部署时配置。

## ⚡ 方法一：一键部署（推荐）

[![Deploy to Cloudflare Pages](https://deploy.pages.dev.svg)](https://deploy.pages.dev/button/github/laochenfei233/weeklyReportGPT)

点击上方按钮开始部署：

1. **连接 GitHub 账户**
2. **选择 Fork 的仓库**（如 `your-username/weeklyReportGPT`）
3. **设置项目名称**（如 `weekly-report`）
4. **配置构建设置**：
   - **框架预设**: `Next.js`
   - **构建命令**: `npm run build`
   - **输出目录**: `out`
   - **根目录**: `/`
5. **点击「部署站点」**
6. **等待构建完成**（约 2-3 分钟）
7. **配置自定义域名**（可选）

## 🔧 方法二：手动部署

### 步骤 1：创建 Cloudflare 账户

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 注册并登录账户

### 步骤 2：创建 Pages 项目

1. 在左侧菜单中点击 **「Workers 和 Pages」**
2. 点击 **「创建」** → **「Pages」** → **「连接到 Git」**
3. 选择你的 GitHub 仓库
4. 配置构建设置：
   ```
   框架预设: Next.js
   构建命令: npm run build
   输出目录: out
   根目录: /
   ```
5. 点击 **「部署站点」**

### 步骤 3：配置域名（可选）

1. 在项目页面点击 **「自定义域」**
2. 点击 **「设置自定义域」**
3. 输入你的域名
4. 按照提示配置 DNS 记录

## 🌍 访问你的站点

部署完成后，你将获得一个免费的子域名：
```
https://your-project.pages.dev
```

或者访问你配置的自定义域名。

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

| 功能 | Cloudflare Pages | Vercel |
|------|------------------|--------|
| 全球 CDN | ✅ | ✅ |
| 免费流量 | ✅ 无限 | ❌ 有限制 |
| 自动部署 | ✅ | ✅ |
| 无服务器函数 | ❌ | ✅ 有限制 |
| 客户端 API | ✅ | ✅ |
| 自定义域名 | ✅ | ✅ |
| SSL 证书 | ✅ 自动 | ✅ 自动 |

## 🔄 更新部署

### 自动更新

当你的 GitHub 仓库有新的提交时，Cloudflare Pages 会自动重新部署。

### 手动更新

1. 进入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 找到你的 Pages 项目
3. 点击 **「部署」** 标签
4. 点击 **「重新部署」**

## 🆘 常见问题

### Q1: 部署失败，提示构建错误？

检查以下几点：
- Node.js 版本是否在 18-22 之间
- 依赖是否正确安装
- 输出目录是否设置为 `out`

### Q2: 网站打开后显示空白？

可能的原因：
- 浏览器缓存问题，尝试强制刷新 (Ctrl+F5)
- 检查浏览器控制台是否有错误
- 确认 `_redirects` 文件已正确部署

### Q3: API 调用失败？

确保：
- API 密钥格式正确
- API 密钥有足够的余额
- 网络连接正常
- 尝试使用 VPN（如果在中国大陆）

### Q4: 如何查看部署日志？

1. 进入 Cloudflare Dashboard
2. 选择你的 Pages 项目
3. 点击 **「部署」** 标签
4. 查看最近的部署记录
5. 点击部署记录查看详细日志

### Q5: 支持 HTTPS 吗？

是的！Cloudflare Pages 自动为所有站点提供 SSL/TLS 加密。

### Q6: 可以部署多个分支吗？

可以！在项目设置中可以配置部署分支。

## 🔒 隐私与安全

- 所有 API 调用直接从用户浏览器发送到 AI 服务商
- 项目不会存储你的 API 密钥
- 数据不会经过任何中间服务器

## 📝 注意事项

1. **API 密钥安全**: 不要将 API 密钥提交到公开的代码仓库
2. **使用限制**: 各 AI 服务商有不同的速率限制，请查阅相应文档
3. **费用**: 请注意各 API 服务商的收费标准

## 📞 获取帮助

- [GitHub Issues](https://github.com/laochenfei233/weeklyReportGPT/issues)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [项目 Wiki](../../wiki)

---

**部署愉快！🎉**
