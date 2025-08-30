# 🔍 故障排除指南

## 🚨 常见问题

### 1. "服务繁忙，请稍后再试"

**可能原因:**
- API密钥未配置或无效
- API密钥余额不足
- API服务暂时不可用
- 网络连接问题

**解决方案:**
1. **检查API密钥配置**
   - 访问 `/debug` 页面进行系统诊断
   - 确认环境变量 `OPENAI_API_KEY` 已正确设置
   - 验证API密钥格式是否正确

2. **验证API密钥有效性**
   - 登录API提供商官网检查余额
   - 确认密钥权限和使用限制
   - 尝试更换新的API密钥

3. **检查网络连接**
   - 访问 `/api/health` 检查服务状态
   - 确认API基础URL可访问
   - 检查防火墙和代理设置



### 2. "API连接失败"

**可能原因:**
- API基础URL配置错误
- 网络连接问题
- API服务维护中

**解决方案:**
1. **检查API配置**
   ```env
   OPENAI_API_BASE=https://api.openai.com/v1  # 确认URL正确
   ```

2. **测试连接**
   - 访问 `/debug` 页面测试API连接
   - 检查API服务状态页面
   - 尝试切换到其他API源

3. **网络诊断**
   ```bash
   # 测试API端点可达性
   curl -I https://api.openai.com/v1/models
   ```

### 3. 生成内容不完整

**可能原因:**
- 请求超时
- Token限制达到
- API响应中断

**解决方案:**
1. **调整参数**
   ```env
   REQUEST_TIMEOUT=30000  # 增加超时时间
   MAX_TOKENS=1500       # 减少token限制
   ```

2. **使用分块生成**
   - 对于长内容，系统会自动使用分块生成
   - 检查是否启用了分块生成功能

3. **选择更快的模型**
   ```env
   OPENAI_MODEL=gpt-3.5-turbo  # 使用更快的模型
   ```

### 4. 登录问题

**可能原因:**
- 账户未激活
- 会话过期

**解决方案:**
  **清除浏览器缓存**
   ```javascript
   // 在浏览器控制台执行
   localStorage.clear();
   sessionStorage.clear();
   ```

## 🛠️ 调试工具

### 1. 系统诊断页面
访问 `/debug` 进行完整的系统检查：

- ✅ 环境变量检查
- ✅ API连接测试
- ✅ JWT配置验证
- ✅ 数据库连接测试
- ✅ 功能完整性测试

### 2. 健康检查端点
访问 `/api/health` 查看服务状态：

```json
{
  "status": "ok",
  "timestamp": "2025-08-30T15:30:00Z",
  "config": {
    "hasApiKey": true,
    "apiBase": "https://api.openai.com/v1",
    "model": "gpt-3.5-turbo"
  }
}
```

### 3. 浏览器开发者工具
1. 按 F12 打开开发者工具
2. 查看 Console 标签的错误信息
3. 检查 Network 标签的请求状态
4. 查看 Application 标签的本地存储

## 📊 性能问题

### 1. 响应速度慢

**优化方案:**
1. **选择更快的API源**
   - OpenAI GPT-3.5: 最快
   - Moonshot: 中等
   - DeepSeek: 较慢但便宜

2. **调整参数**
   ```env
   MAX_TOKENS=800        # 减少输出长度
   REQUEST_TIMEOUT=15000 # 适当的超时时间
   ```

3. **使用CDN加速**
   - 启用Vercel的Edge Network
   - 配置适当的缓存策略

### 2. 内存使用过高

**解决方案:**
1. **清理浏览器缓存**
2. **重启浏览器标签页**
3. **检查是否有内存泄漏**

### 3. 移动端体验差

**优化建议:**
1. **检查响应式设计**
2. **优化触摸交互**
3. **减少不必要的动画**

## 🔧 部署问题

### 1. Vercel部署失败

**常见错误:**
```
Error: Cannot find module '/vercel/path0/scripts/auto-setup-jwt.js'
```

**解决方案:**
1. **使用标准构建命令**
   ```json
   {
     "scripts": {
       "build": "next build"
     }
   }
   ```

2. **检查依赖安装**
   ```bash
   npm install
   npm run build
   ```

3. **清理构建缓存**
   - 在Vercel Dashboard中清理构建缓存
   - 重新触发部署

### 2. 环境变量未生效

**检查步骤:**
1. **确认变量名正确**
2. **检查变量值格式**
3. **确认环境选择正确**（Production/Preview/Development）
4. **重新部署项目**

### 3. 域名访问问题

**解决方案:**
1. **检查DNS配置**
2. **确认SSL证书状态**
3. **验证域名解析**

## 📞 获取帮助

### 1. 自助诊断
- 使用 `/debug` 页面进行系统诊断
- 查看 `/api/health` 端点状态
- 检查浏览器控制台错误

### 2. 社区支持
- [GitHub Issues](https://github.com/laochenfei233/weeklyReportGPT/issues)

### 3. 文档资源
- [部署指南](Deployment-Guide)
- [环境配置](Environment-Configuration)
- [API配置](API-Configuration)

## 📋 问题报告模板

提交问题时，请包含以下信息：

```
**问题描述:**
简要描述遇到的问题

**复现步骤:**
1. 访问页面...
2. 点击按钮...
3. 出现错误...

**预期行为:**
描述期望的正常行为

**实际行为:**
描述实际发生的情况

**环境信息:**
- 浏览器: Chrome 120.0.0
- 操作系统: Windows 11
- 部署平台: Vercel
- API源: OpenAI

**错误信息:**
粘贴完整的错误信息或截图

**调试信息:**
访问 /debug 页面的结果
```

---

*大多数问题都可以通过系统诊断页面快速定位和解决。*