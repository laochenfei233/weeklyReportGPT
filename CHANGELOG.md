# 更新日志

## [2.1.0] - 2025-01-09

### 🎨 UI/UX 改进

- **Markdown渲染优化**: 周报内容现在以更美观的markdown格式显示
- **双重复制功能**: 新增"复制纯文本"和"复制带格式"两种复制选项
- **自定义样式**: 优化了内容显示的排版和样式
- **响应式设计**: 改进了在不同设备上的显示效果

### 🔗 链接更新

- **GitHub仓库**: 更新为 `https://github.com/laochenfei233/weeklyReportGPT`
- **贡献者信息**: 更新Footer显示贡献者信息
- **部署链接**: 更新所有Vercel部署按钮链接

### 📦 依赖更新

- 新增 `@tailwindcss/typography` 插件
- 优化Tailwind CSS配置
- 新增自定义prose样式

---

## [2.0.0] - 2025-01-08

### 🎉 重大更新

- **多API源支持**: 新增对 DeepSeek、Moonshot、智谱AI 等多种 OpenAI 兼容 API 的支持
- **Node.js 22 兼容**: 升级所有依赖包，完全支持 Node.js 22
- **环境变量配置**: 通过环境变量灵活配置 API 源、模型和参数

### ✨ 新特性

- 新增 `utils/apiConfig.ts` - API 提供商配置管理
- 新增 `utils/envCheck.ts` - 环境变量验证工具
- 新增 `scripts/deploy.sh` - 自动化部署脚本
- 支持多个 API 密钥负载均衡（逗号分隔）
- 增强的错误处理和超时控制
- 完善的 TypeScript 类型定义

### 🔧 改进

- 升级 Next.js 到 15.x
- 升级 React 到 18.3.x
- 升级 TypeScript 到 5.7.x
- 优化 API 请求流处理
- 改进错误信息和日志记录
- 增强 Vercel 部署配置

### 🐛 修复

- 修复流式响应的解析错误
- 修复 API 密钥验证逻辑
- 修复超时处理机制
- 优化内存使用

### 📚 文档

- 更新 README 文档，添加详细的配置说明
- 新增多种 API 源的配置示例
- 完善部署指南
- 添加环境变量说明表格

### 🔄 迁移指南

从 1.x 版本升级到 2.0：

1. 更新 `.env` 文件，添加新的环境变量：
   ```bash
   OPENAI_API_BASE=https://api.openai.com/v1
   OPENAI_MODEL=gpt-3.5-turbo
   REQUEST_TIMEOUT=30000
   MAX_TOKENS=2000
   ```

2. 如果使用其他 API 源，更新相应的配置：
   ```bash
   # 例如使用 DeepSeek
   OPENAI_API_BASE=https://api.deepseek.com/v1
   OPENAI_MODEL=deepseek-chat
   ```

3. 重新安装依赖：
   ```bash
   npm install
   ```

### 🚀 部署

- 保持与 Vercel 的完美兼容
- 支持 Docker 部署
- 新增部署检查脚本

---

## [1.x] - 历史版本

- 基础的周报生成功能
- OpenAI GPT-3.5 API 集成
- Vercel Edge Functions 支持
- 国际化支持（中英文）