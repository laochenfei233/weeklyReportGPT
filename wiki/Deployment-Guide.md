# 🚀 部署指南

## 快速部署到 Vercel

### 方法1：一键部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laochenfei233/weeklyReportGPT&env=OPENAI_API_KEY&project-name=weekly-report&repo-name=weekly-report)

点击按钮后：
1. 连接你的GitHub账户
2. 设置项目名称
3. 配置环境变量：`OPENAI_API_KEY`
4. 点击"Deploy"

### 方法2：手动部署

1. **Fork项目**
   ```bash
   # 在GitHub上Fork这个项目
   # 然后克隆到本地
   git clone https://github.com/your-username/weeklyReportGPT.git
   cd weeklyReportGPT
   ```

2. **在Vercel中导入**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击"New Project"
   - 选择你Fork的项目
   - 点击"Import"

3. **配置环境变量**
   
   **必需的环境变量：**
   - `OPENAI_API_KEY` = `your-api-key-here`
   
   **可选的环境变量：**
   - `OPENAI_API_BASE` = `https://api.openai.com/v1`
   - `OPENAI_MODEL` = `gpt-3.5-turbo`
   - `NEXT_PUBLIC_USE_USER_KEY` = `false`

4. **部署完成**
   - JWT密钥会在部署时自动生成
   - 无需手动配置认证相关环境变量

5. **部署**
   - 点击"Deploy"
   - 等待构建完成

## 🔧 环境变量详解

### 必需变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `OPENAI_API_KEY` | OpenAI API密钥 | `sk-...` |

### 可选变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `OPENAI_API_BASE` | `https://api.openai.com/v1` | API基础URL |
| `OPENAI_MODEL` | `gpt-3.5-turbo` | 使用的模型 |
| `NEXT_PUBLIC_USE_USER_KEY` | `false` | 是否允许用户自定义API密钥 |

| `REQUEST_TIMEOUT` | `30000` | 请求超时时间（毫秒） |
| `MAX_TOKENS` | `2000` | 最大生成token数 |

## 🌐 支持的API源

### OpenAI
```env
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### DeepSeek
```env
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_API_BASE=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

### Moonshot
```env
OPENAI_API_KEY=sk-your-moonshot-key
OPENAI_API_BASE=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

### 智谱AI
```env
OPENAI_API_KEY=your-zhipu-key
OPENAI_API_BASE=https://open.bigmodel.cn/api/paas/v4
OPENAI_MODEL=glm-4
```

## 🔍 故障排除

### 常见问题

**1. "服务繁忙，请稍后再试"**
- 检查 `OPENAI_API_KEY` 是否正确设置
- 访问 `/debug` 页面进行系统诊断
- 查看Vercel Functions日志



**3. "API连接失败"**
- 检查 `OPENAI_API_BASE` 是否正确
- 确认API密钥有效且有余额
- 访问 `/api/health` 检查服务状态

### 调试工具

- **系统诊断**: `/debug`
- **健康检查**: `/api/health`


## 📱 使用指南

部署完成后：

1. **访问应用**: `https://your-app.vercel.app`
2. **管理员登录**: 点击设置按钮，在管理员板块通过验证码登录（查看 [管理员登录指南](Admin-Login)）
3. **生成周报**: 输入工作内容，点击生成
4. **个性化设置**: 访问设置页面配置偏好

## 🔄 更新部署

当有新版本时：

1. **同步Fork**:
   ```bash
   git remote add upstream https://github.com/laochenfei233/weeklyReportGPT.git
   git fetch upstream
   git merge upstream/main
   git push origin main
   ```

2. **自动部署**: Vercel会自动检测更改并重新部署

## 🆘 获取帮助

- **GitHub Issues**: [提交问题](https://github.com/laochenfei233/weeklyReportGPT/issues)
- **文档**: 查看项目README
- **调试页面**: 使用内置的调试工具