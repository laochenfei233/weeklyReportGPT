# Vercel 部署指南

## 🚨 免费计划限制

Vercel免费计划有以下限制：
- **函数执行时间**: 最大10秒
- **区域部署**: 仅支持单区域
- **并发请求**: 有限制
- **带宽**: 每月100GB

## ✅ 已优化的配置

### 1. vercel.json配置
```json
{
  "functions": {
    "pages/api/generate.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "REQUEST_TIMEOUT": "8000"
  }
}
```

### 2. API超时设置
- 请求超时: 8秒
- 函数最大执行时间: 10秒
- 针对DeepSeek等慢速API的特殊处理

### 3. 错误处理优化
- 流式传输中断时保存已生成内容
- 超时时显示友好提示
- 自动重试机制

## 🔧 解决方案

### 对于慢速API (如DeepSeek)

**方案1: 使用分块生成API**
```javascript
// 使用 /api/generate-chunk 端点
const response = await fetch('/api/generate-chunk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: yourPrompt,
    chunkIndex: 0,
    totalChunks: 3,
    max_tokens: 800 // 限制每块的token数量
  })
});
```

**方案2: 减少max_tokens**
```javascript
const payload = {
  prompt: yourPrompt,
  max_tokens: 800, // 从2000减少到800
  temperature: 0.7
};
```

**方案3: 简化提示词**
- 避免过于复杂的要求
- 分步骤生成内容
- 使用更直接的指令

## 📊 性能优化建议

### 1. API选择
- **OpenAI GPT-3.5**: 速度快，推荐
- **OpenAI GPT-4**: 较慢，可能超时
- **DeepSeek**: 较慢，建议使用分块生成
- **Moonshot**: 中等速度

### 2. 参数调优
```javascript
{
  "model": "gpt-3.5-turbo", // 选择快速模型
  "max_tokens": 800,        // 限制输出长度
  "temperature": 0.7,       // 适中的创造性
  "stream": true           // 启用流式传输
}
```

### 3. 前端优化
- 显示生成进度
- 实现超时重试
- 保存部分生成内容

## 🚀 升级到Pro计划的好处

如果需要更好的性能，可以考虑升级到Pro计划：
- **函数执行时间**: 最大60秒
- **多区域部署**: 支持全球部署
- **更高并发**: 更多并发请求
- **更大带宽**: 每月1TB

### Pro计划配置示例
```json
{
  "functions": {
    "pages/api/generate.js": {
      "maxDuration": 60
    }
  },
  "regions": ["hkg1", "sin1", "nrt1"],
  "env": {
    "REQUEST_TIMEOUT": "45000"
  }
}
```

## 🔍 故障排除

### 常见错误及解决方案

**1. "Task timed out after 10 seconds"**
- 减少max_tokens参数
- 使用更快的模型
- 简化提示词

**2. "Deploying to multiple regions is restricted"**
- 移除vercel.json中的regions配置
- 或升级到Pro计划

**3. 生成内容不完整**
- 检查是否超时中断
- 使用分块生成API
- 减少单次生成的内容量

## 📝 最佳实践

1. **监控函数执行时间**
   - 在Vercel Dashboard查看函数日志
   - 关注超时警告

2. **优化用户体验**
   - 显示生成进度条
   - 提供超时重试选项
   - 保存部分生成结果

3. **API密钥管理**
   - 使用环境变量存储密钥
   - 支持用户自定义API密钥
   - 实现密钥轮换机制

## 📞 技术支持

如果遇到问题：
1. 查看Vercel函数日志
2. 检查API响应时间
3. 尝试不同的模型和参数
4. 考虑升级到Pro计划

---

*本指南帮助您在Vercel免费计划下获得最佳的部署体验。*