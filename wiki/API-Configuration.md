# 🔌 API 配置指南

## 🌐 支持的API源

Weekly Report GPT 支持多种 AI API 源，您可以根据需要选择最适合的服务商。

### OpenAI 官方
```env
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

**特点:**
- ✅ 响应速度快
- ✅ 质量稳定
- ✅ 模型选择丰富
- ❌ 价格相对较高

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

**特点:**
- ✅ 价格便宜
- ✅ 中文支持好
- ✅ 代码能力强
- ❌ 响应速度较慢

**支持的模型:**
- `deepseek-chat` (通用对话)
- `deepseek-coder` (代码生成)

### Moonshot (月之暗面)
```env
OPENAI_API_KEY=sk-your-moonshot-key
OPENAI_API_BASE=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

**特点:**
- ✅ 中文优化
- ✅ 长上下文支持
- ✅ 价格适中
- ❌ 模型选择较少

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

**特点:**
- ✅ 国产化
- ✅ 中文理解好
- ✅ 多模态支持
- ❌ API格式略有差异

**支持的模型:**
- `glm-4` (最新版本)
- `glm-3-turbo` (快速版本)

### 自定义API源
```env
OPENAI_API_KEY=your-custom-key
OPENAI_API_BASE=https://your-custom-api.com/v1
OPENAI_MODEL=your-custom-model
```

**要求:**
- 兼容 OpenAI API 格式
- 支持流式响应
- 支持 chat/completions 端点

## 🔧 配置方式

### 方式1: 系统级配置（推荐）
在环境变量中配置，所有用户共享：

```env
OPENAI_API_KEY=your-api-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
NEXT_PUBLIC_USE_USER_KEY=false
```

### 方式2: 用户自定义配置
允许用户输入自己的API密钥：

```env
NEXT_PUBLIC_USE_USER_KEY=true
```

用户可以在设置页面配置：
- API密钥
- API基础URL
- 模型选择

### 方式3: 混合模式
系统提供默认配置，用户可选择使用自己的密钥：

```env
OPENAI_API_KEY=system-default-key
NEXT_PUBLIC_USE_USER_KEY=true
```

## 🔑 API密钥管理

### 多密钥轮换
支持配置多个API密钥，系统自动轮换使用：

```env
OPENAI_API_KEY=sk-key1,sk-key2,sk-key3
```

### 密钥格式验证
系统会自动验证API密钥格式：

- **OpenAI**: `sk-` 开头，48字符
- **DeepSeek**: `sk-` 开头
- **Moonshot**: `sk-` 开头
- **智谱AI**: 不以 `sk-` 开头

### 密钥安全
- 使用环境变量存储
- 不在前端暴露
- 支持定期轮换

## ⚡ 性能优化

### 模型选择建议

**速度优先:**
1. `gpt-3.5-turbo` (OpenAI)
2. `moonshot-v1-8k` (Moonshot)
3. `glm-3-turbo` (智谱AI)

**质量优先:**
1. `gpt-4` (OpenAI)
2. `deepseek-chat` (DeepSeek)
3. `glm-4` (智谱AI)

**成本优先:**
1. `deepseek-chat` (DeepSeek)
2. `moonshot-v1-8k` (Moonshot)
3. `glm-3-turbo` (智谱AI)

### 参数调优
```javascript
{
  "model": "gpt-3.5-turbo",
  "max_tokens": 2000,      // 根据需要调整
  "temperature": 0.7,      // 创造性程度
  "top_p": 1,             // 采样参数
  "frequency_penalty": 0,  // 重复惩罚
  "presence_penalty": 0,   // 存在惩罚
  "stream": true          // 启用流式响应
}
```

## 🔍 API测试

### 健康检查
访问 `/api/health` 检查API配置状态：

```json
{
  "status": "ok",
  "config": {
    "hasApiKey": true,
    "apiBase": "https://api.openai.com/v1",
    "model": "gpt-3.5-turbo",
    "provider": "OpenAI"
  },
  "test": {
    "connection": "ok",
    "latency": "245ms"
  }
}
```

### 调试页面
访问 `/debug` 进行完整的API测试：

1. **连接测试**: 验证API端点可达性
2. **认证测试**: 验证API密钥有效性
3. **功能测试**: 测试实际生成功能
4. **性能测试**: 测量响应时间

## 🚨 错误处理

### 常见错误

**1. API密钥无效**
```json
{
  "error": "Invalid API key",
  "code": "invalid_api_key"
}
```

**解决方案:**
- 检查密钥格式
- 确认密钥有效
- 验证API源匹配

**2. 余额不足**
```json
{
  "error": "Insufficient quota",
  "code": "insufficient_quota"
}
```

**解决方案:**
- 检查账户余额
- 充值或更换密钥
- 使用其他API源

**3. 请求超时**
```json
{
  "error": "Request timeout",
  "code": "timeout"
}
```

**解决方案:**
- 增加超时时间
- 减少max_tokens
- 选择更快的API源

### 错误监控
系统会自动记录API错误：
- 错误类型统计
- 响应时间监控
- 成功率追踪

## 📊 使用统计

### Token使用量
系统会记录每个API源的使用情况：
- 输入token数
- 输出token数
- 总使用量
- 成本估算

### 性能指标
- 平均响应时间
- 成功率
- 错误率
- 并发处理能力

## 🔄 API源切换

### 自动切换
当主API源出现问题时，系统可以自动切换到备用API源：

```env
# 主API源
OPENAI_API_KEY=primary-key
OPENAI_API_BASE=https://api.openai.com/v1

# 备用API源
BACKUP_API_KEY=backup-key
BACKUP_API_BASE=https://api.deepseek.com/v1
```

### 手动切换
用户可以在设置页面手动选择API源：
1. 打开设置页面
2. 选择"API配置"
3. 选择不同的API源
4. 输入对应的密钥

## 🛡️ 安全考虑

### API密钥保护
- 不在客户端存储密钥
- 使用HTTPS传输
- 定期轮换密钥

### 访问控制
- 用户级别的使用限制
- 管理员权限控制
- API调用频率限制

### 数据隐私
- 不记录用户输入内容
- API调用日志脱敏
- 遵循数据保护法规

---

*选择合适的API源可以显著提升用户体验和降低成本。*