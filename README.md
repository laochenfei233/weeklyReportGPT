# [Weekly Report](https://weeklyreport.avemaria.fun/)

## [English](README_EN.md)

简单描述工作内容，帮你生成完整周报

[![Weekly Report](./public/screenshot.jpg)](https://weeklyreport.avemaria.fun/zh)

## ✨ 主要特性

- 🎨 **个性化设置**: 字体、主题、语言等自定义配置
- 🔄 **多API源支持**: OpenAI、DeepSeek、Moonshot、智谱AI 等
- 🚀 **一键部署**: 完美支持 Vercel 部署
- 🔧 **调试工具**: 内置系统诊断和健康检查
- 🛡️ **隐私保护**: 数据不存储，支持自定义API密钥

## 🚀 快速开始

### 本地运行

```bash
# 1. 克隆项目
git clone https://github.com/laochenfei233/weeklyReportGPT.git
cd weeklyReportGPT

# 2. 安装依赖
npm install

# 3. 快速设置
npm run setup

# 4. 启动开发服务器
npm run dev
```

### 环境变量配置

复制 `.env.example` 为 `.env`，配置必要的环境变量：

```bash
OPENAI_API_KEY=your-api-key-here
NEXT_PUBLIC_USE_USER_KEY=false
```

📋 **详细配置**: 查看 [环境配置指南](../../wiki/Environment-Configuration)

## ☁️ 部署到 Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laochenfei233/weeklyReportGPT&env=OPENAI_API_KEY,NEXT_PUBLIC_USE_USER_KEY&project-name=weeklyReportGPT&repo-name=weeklyReportGPT)

### 环境变量配置

在 Vercel 项目设置中添加：
- `OPENAI_API_KEY` = `your-api-key-here`
- `NEXT_PUBLIC_USE_USER_KEY` = `false`

🚀 **完整部署指南**: 查看 [Vercel 部署教程](../../wiki/Vercel-Deployment)

## 📖 使用指南

### 基本使用
1. 访问网站，在文本框中描述工作内容
2. 点击生成按钮，等待AI生成周报
3. 复制生成的周报到需要的地方

### 示例输入
```
本周完成了用户管理系统的开发，包括用户注册、登录、权限管理等功能。
修复了订单系统中的3个bug，提升了系统稳定性。
参与了2次技术评审会议，协助制定了新项目的技术方案。
```

### Token使用限制
- **默认限制**: 每用户1万Token（包括输入和输出）
- **解除限制**: 管理员登录或配置自定义API密钥

### 个性化设置
点击右上角齿轮图标 ⚙️ 进行配置：
- 主题切换（浅色/深色/自动）
- 字体和语言设置
- API配置和管理员登录

🔧 **详细使用指南**: 查看 [使用教程](../../wiki/Usage-Guide)

## 📚 完整文档

详细的使用指南和技术文档请查看我们的 [Wiki 文档](../../wiki)：

- [📖 使用指南](../../wiki/Usage-Guide) - 详细的使用教程和技巧
- [🔧 支持的API源](../../wiki/Supported-APIs) - 多种AI服务商配置说明
- [🚀 部署指南](../../wiki/Deployment-Guide) - 完整的部署说明和配置
- [🔍 故障排除](../../wiki/Troubleshooting) - 常见问题和解决方案
- [⚙️ 设置系统](../../wiki/Settings-System) - 个性化设置和主题配置
- [🔐 管理员登录](../../wiki/Admin-Login) - 验证码登录和管理员功能

## 🔒 隐私保护

- 您的输入内容不会被永久存储
- 仅在生成周报时临时处理数据
- 支持使用自己的API密钥增强隐私控制
- 详细信息请查看 [隐私政策](../../wiki/Privacy-Policy)

## 感谢

受 [TwtterBio](https://github.com/Nutlope/twitterbio) 和 [chat-simplifier](https://github.com/zhengbangbo/chat-simplifier) 启发.