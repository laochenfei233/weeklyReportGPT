# 🔧 支持的API源

本项目支持多种AI API源，您可以根据需要选择最适合的服务商。

## 📋 API源列表

| 提供商 | 基础URL | 模型示例 | 说明 |
|--------|---------|----------|------|
| **OpenAI** | `https://api.openai.com/v1` | `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo` | 官方 OpenAI API |
| **DeepSeek** | `https://api.deepseek.com/v1` | `deepseek-chat`, `deepseek-coder` | DeepSeek AI，性价比高 |
| **Moonshot** | `https://api.moonshot.cn/v1` | `moonshot-v1-8k`, `moonshot-v1-32k`, `moonshot-v1-128k` | 月之暗面，支持长上下文 |
| **智谱AI** | `https://open.bigmodel.cn/api/paas/v4` | `glm-4`, `glm-3-turbo` | 智谱 GLM 系列 |
| **通义千问** | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-turbo`, `qwen-plus`, `qwen-max` | 阿里云通义千问 |
| **自定义** | 自定义URL | 自定义模型 | 任何兼容 OpenAI 格式的API |

## 🔧 配置示例

### OpenAI 官方
```bash
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

**推荐模型：**
- `gpt-3.5-turbo`: 性价比最高，适合大多数场景
- `gpt-4`: 质量更高，成本较高
- `gpt-4-turbo`: 最新模型，平衡质量和速度

### DeepSeek
```bash
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_API_BASE=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

**特点：**
- 性价比极高
- 中文理解能力强
- 代码生成能力优秀

### Moonshot (月之暗面)
```bash
OPENAI_API_KEY=sk-your-moonshot-key
OPENAI_API_BASE=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

**推荐模型：**
- `moonshot-v1-8k`: 8K上下文，适合一般使用
- `moonshot-v1-32k`: 32K上下文，适合长文档
- `moonshot-v1-128k`: 128K上下文，适合超长内容

### 智谱AI (GLM)
```bash
OPENAI_API_KEY=your-zhipu-key
OPENAI_API_BASE=https://open.bigmodel.cn/api/paas/v4
OPENAI_MODEL=glm-4
```

**推荐模型：**
- `glm-4`: 最新版本，综合能力强
- `glm-3-turbo`: 速度更快，成本更低

### 通义千问
```bash
OPENAI_API_KEY=sk-your-qwen-key
OPENAI_API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen-turbo
```

**推荐模型：**
- `qwen-turbo`: 速度快，成本低
- `qwen-plus`: 平衡性能和成本
- `qwen-max`: 最高质量

## 🌐 第三方代理服务

如果您无法直接访问官方API，可以使用兼容OpenAI格式的代理服务：

### 配置方法
```bash
OPENAI_API_KEY=your-proxy-key
OPENAI_API_BASE=https://your-proxy-domain.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### 常见代理服务
- **OpenAI代理**: 提供OpenAI API的镜像服务
- **多合一代理**: 集成多个AI服务商的统一接口
- **自建代理**: 使用开源项目搭建的代理服务

## 💰 成本对比

| 服务商 | 相对成本 | 质量评级 | 速度评级 | 推荐场景 |
|--------|----------|----------|----------|----------|
| OpenAI | 高 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 质量要求高 |
| DeepSeek | 低 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 性价比优先 |
| Moonshot | 中 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 长文档处理 |
| 智谱AI | 中 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中文场景 |
| 通义千问 | 低 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 速度优先 |

## 🔄 多密钥轮换

支持配置多个API密钥进行轮换使用：

```bash
# 使用逗号分隔多个密钥
OPENAI_API_KEY=key1,key2,key3
```

**优势：**
- 提高请求成功率
- 分散API调用压力
- 避免单个密钥限流

## 🛠️ 自定义配置

### 高级参数
```bash
# 请求超时时间（毫秒）
REQUEST_TIMEOUT=30000

# 最大生成token数
MAX_TOKENS=2000

# 温度参数（0-1，控制创造性）
TEMPERATURE=0.7

# 是否允许用户自定义API密钥
NEXT_PUBLIC_USE_USER_KEY=false
```

### 模型参数调优
不同的使用场景可以调整模型参数：

**保守模式（一致性高）：**
```bash
TEMPERATURE=0.3
MAX_TOKENS=1500
```

**创意模式（多样性高）：**
```bash
TEMPERATURE=0.8
MAX_TOKENS=2500
```

## 🔍 API测试

### 健康检查
访问 `/api/health` 可以测试当前API配置：
- API连接状态
- 模型可用性
- 响应时间

### 调试页面
访问 `/debug` 进行完整的API测试：
- 环境变量检查
- API连接测试
- 生成功能验证

## ❓ 常见问题

### Q: 如何选择合适的API源？
A: 建议考虑以下因素：
- **预算**: DeepSeek和通义千问成本较低
- **质量**: OpenAI和智谱AI质量较高
- **速度**: 通义千问和DeepSeek速度较快
- **语言**: 中文场景推荐智谱AI和DeepSeek

### Q: API密钥如何获取？
A: 各服务商官网注册账号后，在控制台创建API密钥：
- [OpenAI Platform](https://platform.openai.com/api-keys)
- [DeepSeek Platform](https://platform.deepseek.com/api_keys)
- [Moonshot Platform](https://platform.moonshot.cn/console/api-keys)
- [智谱AI开放平台](https://open.bigmodel.cn/usercenter/apikeys)

### Q: 可以同时使用多个API源吗？
A: 目前每次部署只能配置一个API源，但可以通过环境变量快速切换。

### Q: 如何处理API限流？
A: 建议：
- 配置多个API密钥轮换使用
- 选择限流较少的服务商
- 合理设置请求超时时间

---

*更多API配置详情请查看 [API配置指南](API-Configuration)。*