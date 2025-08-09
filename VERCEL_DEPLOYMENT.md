# Vercel 部署指南

## 🚀 快速部署

### 方法一：一键部署

点击下面的按钮进行一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/laochenfei233/weeklyReportGPT&env=OPENAI_API_KEY,NEXT_PUBLIC_USE_USER_KEY&project-name=weeklyReportGPT&repo-name=weeklyReportGPT)

### 方法二：手动部署

1. **Fork 项目**
   - 访问项目 GitHub 页面
   - 点击右上角的 "Fork" 按钮

2. **导入到 Vercel**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你 Fork 的项目
   - 点击 "Import"

3. **配置环境变量**
   - 在项目导入页面，展开 "Environment Variables" 部分
   - 或者在项目创建后，进入 Settings > Environment Variables

## 🔧 环境变量配置

### 必需变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `OPENAI_API_KEY` | `sk-your-api-key` | 你的 API 密钥 |
| `NEXT_PUBLIC_USE_USER_KEY` | `false` | 是否允许用户输入密钥 |

### 可选变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `OPENAI_API_BASE` | `https://api.openai.com/v1` | API 基础 URL |
| `OPENAI_MODEL` | `gpt-3.5-turbo` | 使用的模型 |
| `REQUEST_TIMEOUT` | `30000` | 请求超时时间（毫秒） |
| `MAX_TOKENS` | `2000` | 最大生成 token 数 |

## 📝 配置步骤详解

### 1. 添加环境变量

在 Vercel 项目设置中：

1. 进入项目页面
2. 点击 **Settings** 标签
3. 在左侧菜单选择 **Environment Variables**
4. 点击 **Add** 按钮
5. 填写变量信息：
   - **Name**: 变量名
   - **Value**: 变量值
   - **Environment**: 选择环境（建议全选）
6. 点击 **Save**

### 2. 不同 API 源配置示例

#### OpenAI 官方
```
OPENAI_API_KEY = sk-your-openai-key
OPENAI_API_BASE = https://api.openai.com/v1
OPENAI_MODEL = gpt-3.5-turbo
```

#### DeepSeek
```
OPENAI_API_KEY = sk-your-deepseek-key
OPENAI_API_BASE = https://api.deepseek.com/v1
OPENAI_MODEL = deepseek-chat
```

#### Moonshot
```
OPENAI_API_KEY = sk-your-moonshot-key
OPENAI_API_BASE = https://api.moonshot.cn/v1
OPENAI_MODEL = moonshot-v1-8k
```

#### 智谱AI
```
OPENAI_API_KEY = your-zhipu-key
OPENAI_API_BASE = https://open.bigmodel.cn/api/paas/v4
OPENAI_MODEL = glm-4
```

### 3. 重新部署

配置完环境变量后：

1. 进入项目的 **Deployments** 标签
2. 点击最新部署右侧的三个点
3. 选择 **Redeploy**
4. 等待部署完成

## 🔍 故障排除

### 常见错误

1. **Environment Variable references Secret which does not exist**
   - 原因：`vercel.json` 中引用了不存在的 Secret
   - 解决：确保 `vercel.json` 不包含 `env` 配置，或者先创建对应的 Secret

2. **API key format error**
   - 原因：API 密钥格式不正确
   - 解决：检查密钥格式是否符合对应 API 源的要求

3. **Request timeout**
   - 原因：请求超时
   - 解决：增加 `REQUEST_TIMEOUT` 值或检查 API 源可用性

### 调试方法

1. **查看部署日志**
   - 在 Vercel 项目页面，点击失败的部署
   - 查看 Build Logs 和 Function Logs

2. **使用健康检查**
   - 访问 `https://your-domain.vercel.app/api/health`
   - 查看环境配置状态

3. **本地测试**
   - 使用相同的环境变量在本地运行
   - 确保配置正确后再部署

## 🎯 部署检查清单

- [ ] Fork 项目到个人 GitHub
- [ ] 在 Vercel 中导入项目
- [ ] 配置必需的环境变量
- [ ] 配置可选的环境变量（如需要）
- [ ] 部署成功
- [ ] 访问 `/api/health` 检查状态
- [ ] 测试周报生成功能

## 📞 获取帮助

如果遇到部署问题：

1. 检查 [Vercel 文档](https://vercel.com/docs)
2. 查看项目的 Issues 页面
3. 确保 API 密钥有效且有足够的配额