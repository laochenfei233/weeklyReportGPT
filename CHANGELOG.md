# 更新日志

## [2.0.0] - 2025-01-09

### 🎉 重大更新

基于原版项目 [guaguaguaxia/weekly_report](https://github.com/guaguaguaxia/weekly_report) 进行全面升级和优化。

### 🚀 核心功能升级

- **多API源支持**: 支持 OpenAI、DeepSeek、Moonshot、智谱AI、火山引擎等多种API源
- **实时Markdown渲染**: 类似Typora的所见即所得体验，内容生成过程中实时渲染
- **Typora风格界面**: 优雅的编辑器界面设计，专业的文档排版效果
- **Node.js 22兼容**: 升级所有依赖包，支持最新版本

### ✨ 用户体验改进

- **即时预览**: 无需手动切换，生成过程中即可看到最终排版效果
- **优雅排版**: 
  - 标题层级和下划线样式
  - 列表、引用、代码块的精美样式
  - 表格的响应式设计
  - 平滑的动画过渡效果
- **智能复制**: 支持纯文本和带格式两种复制方式
- **加载反馈**: 清晰的生成状态指示和进度反馈

### 🔧 技术架构升级

- **环境变量配置**: 通过环境变量灵活配置API源和参数
- **错误处理增强**: 完善的错误处理和超时控制机制
- **调试工具**: 内置调试页面和健康检查API
- **性能优化**: 
  - 防抖技术避免过度渲染
  - requestAnimationFrame优化渲染性能
  - 智能缓存和状态管理

### 📦 依赖和配置

- Next.js 15.x
- React 18.3.x  
- TypeScript 5.7.x
- Tailwind CSS 3.4.x
- Marked 14.x (Markdown解析)
- 新增 @tailwindcss/typography 插件

### 🌐 部署支持

- **Vercel**: 完美兼容，一键部署
- **Docker**: 支持容器化部署
- **环境变量**: 灵活的配置管理
- **多区域**: 支持不同API服务商的区域配置

### 🔗 链接更新

- **项目仓库**: https://github.com/laochenfei233/weeklyReportGPT
- **原版项目**: https://github.com/guaguaguaxia/weekly_report
- **贡献者**: guaguaguaxia & laochenfei233
- **技术支持**: Claude Sonnet 4.0 & Kiro

### 📋 配置示例

```bash
# OpenAI官方
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

# DeepSeek
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_API_BASE=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat

# 火山引擎
OPENAI_API_KEY=your-volcengine-key
OPENAI_API_BASE=https://ark.cn-beijing.volces.com/api/v3/bots/
OPENAI_MODEL=bot-20250404114220-z2xsd
```

---

## [1.0.0] - 历史版本

原版项目功能：
- 基础的周报生成功能
- OpenAI GPT-3.5 API 集成
- Vercel Edge Functions 支持
- 国际化支持（中英文）
- 简单的Markdown渲染

**原版项目地址**: https://github.com/guaguaguaxia/weekly_report