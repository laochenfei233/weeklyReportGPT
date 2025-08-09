# 调试指南

## 🔍 问题诊断

当遇到"服务繁忙，请稍后再试"错误时，请按以下步骤进行诊断：

### 1. 检查健康状态

访问健康检查端点：
```
https://your-domain.vercel.app/api/health
```

这会显示：
- 环境变量配置状态
- API密钥是否存在
- 配置验证结果

### 2. 使用调试页面（推荐）

访问调试页面进行可视化测试：
```
https://your-domain.vercel.app/debug
```

这个页面提供：
- 一键运行所有基础测试
- 可视化的测试结果
- 详细的错误信息
- 周报生成功能测试

### 3. 手动测试各个端点

#### 健康检查 (GET)
```bash
curl https://your-domain.vercel.app/api/health
```

#### 验证API密钥 (GET)
```bash
curl https://your-domain.vercel.app/api/validate-key
```

#### 测试API连接 (POST)
```bash
curl -X POST https://your-domain.vercel.app/api/test
```

#### 浏览器开发者工具测试
```javascript
// 健康检查
fetch('/api/health').then(res => res.json()).then(console.log);

// 验证密钥
fetch('/api/validate-key').then(res => res.json()).then(console.log);

// 测试API
fetch('/api/test', { method: 'POST' }).then(res => res.json()).then(console.log);
```

### 3. 检查Vercel日志

1. 进入Vercel项目页面
2. 点击 **Functions** 标签
3. 查看 `/api/generate` 的日志
4. 查找具体的错误信息

## 🛠️ 常见问题解决

### 问题1: API密钥未配置
**错误**: "API key is required"
**解决**: 
1. 在Vercel项目设置中添加 `OPENAI_API_KEY` 环境变量
2. 确保密钥格式正确（通常以 `sk-` 开头）

### 问题2: API密钥格式错误
**错误**: "Invalid API key format" 或格式警告
**解决**: 
1. 检查密钥是否有多余的空格或换行符
2. 确认密钥格式：
   - OpenAI/DeepSeek/Moonshot: `sk-` 开头，至少20位字符
   - 智谱AI: 至少16位字符（无 `sk-` 前缀）
3. 使用 `/api/validate-key` 端点检查具体问题
4. 重新复制粘贴API密钥

### 问题3: API端点不可达
**错误**: "API request failed: 502"
**解决**:
1. 检查 `OPENAI_API_BASE` 是否正确
2. 确认API服务商服务正常
3. 检查网络连接

### 问题4: 模型不存在
**错误**: "model not found"
**解决**:
1. 检查 `OPENAI_MODEL` 配置
2. 确认该模型在对应API源中可用
3. 使用默认模型进行测试

### 问题5: 配额不足
**错误**: "quota exceeded" 或 "insufficient credits"
**解决**:
1. 检查API账户余额
2. 检查使用配额限制
3. 联系API服务商

## 🔧 调试步骤

### 步骤1: 验证环境变量
```bash
# 检查必需的环境变量
curl https://your-domain.vercel.app/api/health

# 验证API密钥格式
curl https://your-domain.vercel.app/api/validate-key
```

### 步骤2: 测试API连接
```bash
# 测试API是否可用
curl -X POST https://your-domain.vercel.app/api/test
```

### 步骤3: 查看详细错误
1. 打开浏览器开发者工具
2. 尝试生成周报
3. 查看Network标签中的错误响应
4. 查看Console中的错误日志

### 步骤4: 本地测试
```bash
# 在本地运行项目
npm run dev

# 使用相同的环境变量
# 查看控制台输出
```

## 📋 环境变量检查清单

- [ ] `OPENAI_API_KEY` - API密钥已设置且格式正确
- [ ] `OPENAI_API_BASE` - API基础URL正确
- [ ] `OPENAI_MODEL` - 模型名称正确且可用
- [ ] `NEXT_PUBLIC_USE_USER_KEY` - 设置为 `false`（除非允许用户输入密钥）
- [ ] `REQUEST_TIMEOUT` - 超时时间合理（建议30000毫秒）
- [ ] `MAX_TOKENS` - 最大token数合理（建议2000）

## 🚨 紧急修复

如果问题紧急，可以尝试以下快速修复：

### 1. 重置为OpenAI官方API
```
OPENAI_API_KEY=sk-your-openai-key
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### 2. 增加超时时间
```
REQUEST_TIMEOUT=60000
```

### 3. 减少token数量
```
MAX_TOKENS=1000
```

### 4. 启用用户密钥模式
```
NEXT_PUBLIC_USE_USER_KEY=true
```

## 📞 获取帮助

1. **查看Vercel日志**: 最详细的错误信息
2. **使用健康检查**: 快速诊断配置问题
3. **本地测试**: 排除部署环境问题
4. **API文档**: 查看对应API服务商的文档

## 🔄 重新部署

修改环境变量后：
1. 在Vercel项目页面点击 **Redeploy**
2. 或者推送新的代码触发自动部署
3. 等待部署完成后再次测试