# 🔧 调试工具指南

## 🎯 概述

Weekly Report GPT 内置了完整的调试工具集，帮助用户快速诊断和解决问题。

## 🛠️ 调试页面

### 访问方式
```
https://your-app.vercel.app/debug
```

### 功能特性
- ✅ **环境变量检查** - 验证所有必需的环境变量
- ✅ **API连接测试** - 测试与AI API的连接状态
- ✅ **JWT配置验证** - 检查认证系统配置
- ✅ **数据库连接** - 验证数据库连接状态
- ✅ **功能测试** - 端到端功能测试
- ✅ **性能监控** - 响应时间和性能指标

### 界面预览
```
┌─────────────────────────────────────┐
│ 🔧 系统诊断                        │
├─────────────────────────────────────┤
│ ✅ 环境变量检查                     │
│ ✅ API连接测试                      │
│ ✅ JWT配置验证                      │
│ ❌ 数据库连接失败                   │
│ ⚠️  功能测试部分失败                │
└─────────────────────────────────────┘
```

## 🏥 健康检查端点

### 访问方式
```
GET https://your-app.vercel.app/api/health
```

### 响应格式
```json
{
  "status": "ok",
  "timestamp": "2025-08-30T15:30:00Z",
  "version": "2.2.0",
  "config": {
    "hasApiKey": true,
    "apiBase": "https://api.openai.com/v1",
    "model": "gpt-3.5-turbo",
    "useUserKey": false,
    "hasJwtSecret": true
  },
  "performance": {
    "uptime": "2h 15m 30s",
    "memoryUsage": "45.2 MB",
    "responseTime": "125ms"
  },
  "features": {
    "authentication": "enabled",
    "database": "connected",
    "emailService": "configured"
  }
}
```

### 状态码说明
- `200` - 系统正常运行
- `500` - 系统存在问题
- `503` - 服务暂时不可用

## 🔍 具体检查项目

### 1. 环境变量检查

**检查项目:**
- `OPENAI_API_KEY` - API密钥配置
- `OPENAI_API_BASE` - API基础URL
- `OPENAI_MODEL` - 模型配置
- `JWT_SECRET` - JWT密钥
- `NEXT_PUBLIC_USE_USER_KEY` - 用户密钥模式

**状态显示:**
```
✅ OPENAI_API_KEY: 已配置 (sk-***...***abc)
✅ OPENAI_API_BASE: https://api.openai.com/v1
✅ OPENAI_MODEL: gpt-3.5-turbo
❌ JWT_SECRET: 未配置
⚠️  NEXT_PUBLIC_USE_USER_KEY: false (推荐设置)
```

### 2. API连接测试

**测试步骤:**
1. **连通性测试** - 检查API端点是否可达
2. **认证测试** - 验证API密钥有效性
3. **功能测试** - 发送测试请求
4. **性能测试** - 测量响应时间

**结果显示:**
```
✅ 连通性: 正常 (245ms)
✅ 认证: 有效
✅ 功能: 正常
⚠️  性能: 较慢 (2.3s)
```

### 3. JWT配置验证

**检查项目:**
- JWT密钥是否存在
- 密钥长度和强度
- 签名算法配置
- 过期时间设置

**修复建议:**
```
❌ JWT密钥未配置
💡 建议: 访问 /auto-init 自动生成
💡 或者: 访问 /generate-jwt 手动生成
```

### 4. 数据库连接测试

**检查项目:**
- 数据库连接状态
- 表结构完整性
- 权限验证
- 查询性能

**状态显示:**
```
✅ 连接状态: 正常
✅ 表结构: 完整
✅ 权限: 正常
⚠️  查询性能: 较慢 (500ms)
```

## 🚀 快速诊断工具

### 1. 一键诊断
访问调试页面后，点击"开始诊断"按钮：
```javascript
// 自动执行所有检查项目
const runDiagnosis = async () => {
  const results = await Promise.all([
    checkEnvironment(),
    testApiConnection(),
    verifyJwtConfig(),
    testDatabase(),
    runFunctionTests()
  ]);
  return results;
};
```

### 2. 问题自动修复
对于常见问题，系统提供自动修复建议：

**JWT密钥缺失:**
```
❌ 问题: JWT密钥未配置
🔧 修复: [点击自动生成JWT密钥]
```

**API密钥无效:**
```
❌ 问题: API密钥无效或过期
🔧 修复: [检查密钥配置] [测试新密钥]
```

### 3. 性能分析
```javascript
{
  "apiResponseTime": "245ms",
  "databaseQueryTime": "89ms",
  "totalRequestTime": "334ms",
  "memoryUsage": "45.2MB",
  "cpuUsage": "12%"
}
```

## 📊 监控面板

### 实时状态监控
```
┌─────────────────────────────────────┐
│ 📊 实时监控                        │
├─────────────────────────────────────┤
│ 🟢 API状态: 正常                   │
│ 🟢 数据库: 连接中                  │
│ 🟡 响应时间: 1.2s (较慢)           │
│ 🟢 内存使用: 45MB/512MB            │
│ 🟢 错误率: 0.1%                    │
└─────────────────────────────────────┘
```

### 历史数据
- 过去24小时的性能趋势
- 错误日志统计
- API调用成功率
- 用户活跃度

## 🔧 高级调试功能

### 1. 日志查看器
```javascript
// 查看最近的错误日志
const logs = await fetch('/api/debug/logs').then(r => r.json());
console.table(logs);
```

### 2. 配置导出
```javascript
// 导出当前配置（脱敏）
const config = await fetch('/api/debug/config').then(r => r.json());
```

### 3. 性能分析器
```javascript
// 分析性能瓶颈
const profile = await fetch('/api/debug/profile').then(r => r.json());
```

## 🛡️ 安全考虑

### 数据脱敏
调试信息中的敏感数据会自动脱敏：
```
API密钥: sk-***...***abc (显示前3位和后3位)
JWT密钥: ***...*** (完全隐藏)
数据库URL: postgres://***@***.com/*** (隐藏凭据)
```

### 访问控制
- 生产环境需要管理员权限
- 开发环境允许匿名访问
- 敏感操作需要二次确认

### 审计日志
所有调试操作都会记录：
- 操作时间
- 操作用户
- 操作类型
- 操作结果

## 📱 移动端调试

### 移动端适配
- 响应式调试界面
- 触摸友好的操作
- 简化的信息显示

### 远程调试
```javascript
// 启用远程调试
localStorage.setItem('debug_mode', 'true');
// 查看调试信息
console.log(window.debugInfo);
```

## 🔄 自动化测试

### 定期健康检查
系统会定期执行健康检查：
- 每5分钟检查API状态
- 每小时检查数据库连接
- 每天检查配置完整性

### 告警机制
当检测到问题时：
- 记录错误日志
- 发送告警通知（如配置）
- 尝试自动恢复

## 💡 使用建议

### 1. 定期检查
建议定期访问调试页面检查系统状态：
- 部署后立即检查
- 遇到问题时检查
- 定期维护时检查

### 2. 问题排查流程
1. 访问 `/debug` 页面
2. 查看所有检查项目
3. 重点关注红色❌和黄色⚠️项目
4. 按照修复建议操作
5. 重新运行诊断验证

### 3. 性能优化
根据调试结果优化系统：
- API响应时间过长 → 更换API源
- 内存使用过高 → 检查内存泄漏
- 错误率过高 → 检查配置问题

---

*调试工具是保证系统稳定运行的重要保障，建议熟练掌握使用方法。*