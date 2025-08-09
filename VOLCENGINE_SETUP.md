# 火山引擎（字节跳动）API 配置指南

## 🔥 火山引擎 Ark API 配置

火山引擎的API格式与标准OpenAI格式略有不同，本项目已经添加了专门的适配器支持。

### 📋 配置步骤

1. **获取API密钥**
   - 访问 [火山引擎控制台](https://console.volcengine.com/)
   - 创建或选择你的Bot
   - 获取API密钥

2. **配置环境变量**
   
   **方式一：baseURL包含bots路径（推荐）**
   ```bash
   OPENAI_API_KEY=your-volcengine-api-key
   OPENAI_API_BASE=https://ark.cn-beijing.volces.com/api/v3/bots/
   OPENAI_MODEL=bot-20250404114220-z2xsd
   ```
   
   **方式二：baseURL不包含bots路径**
   ```bash
   OPENAI_API_KEY=your-volcengine-api-key
   OPENAI_API_BASE=https://ark.cn-beijing.volces.com/api/v3
   OPENAI_MODEL=bot-20250404114220-z2xsd
   ```

3. **Bot ID 说明**
   - `OPENAI_MODEL` 应该设置为你的Bot ID
   - 格式通常为: `bot-yyyymmddhhmmss-xxxxx`
   - 可以在火山引擎控制台中找到
   - 最终端点会是: `https://ark.cn-beijing.volces.com/api/v3/bots/bot-20250404114220-z2xsd/chat/completions`

### 🔧 API 端点格式

火山引擎使用以下端点格式：
```
https://ark.cn-beijing.volces.com/api/v3/bots/{bot_id}/chat/completions
```

项目会自动处理端点的构建，你只需要配置：
- `OPENAI_API_BASE`: `https://ark.cn-beijing.volces.com/api/v3/bots/`
- `OPENAI_MODEL`: 你的Bot ID

### 🧪 测试配置

使用以下端点测试你的配置：

1. **健康检查**
   ```
   GET https://your-domain.vercel.app/api/health
   ```

2. **API密钥验证**
   ```
   GET https://your-domain.vercel.app/api/validate-key
   ```

3. **API连接测试**
   ```
   POST https://your-domain.vercel.app/api/test
   ```

4. **火山引擎深度调试**
   ```
   POST https://your-domain.vercel.app/api/volcengine-debug
   ```

5. **配置文档检查**
   ```
   GET https://your-domain.vercel.app/api/check-volcengine-docs
   ```

### 🔍 常见问题

#### 问题1: Bot ID 格式错误 (404 Not Found)
**症状**: API调用失败，返回404错误
**原因**: Bot ID格式不正确或Bot不存在
**解决**: 
1. 确认Bot ID格式: `bot-YYYYMMDDHHMMSS-XXXXX`
2. 在火山引擎控制台验证Bot是否存在
3. 检查Bot状态是否为"已发布"或"活跃"
4. 使用 `/api/check-volcengine-docs` 验证配置

#### 问题2: API密钥无效 (401 Unauthorized)
**症状**: 返回401认证错误
**解决**:
1. 检查API密钥是否正确复制
2. 确认密钥对应的账户有权限访问该Bot
3. 检查密钥是否已过期
4. 在火山引擎控制台重新生成密钥

#### 问题3: 区域配置错误 (网络错误)
**症状**: 网络连接失败或超时
**解决**:
1. 确认使用正确的区域端点
   - 北京区域: `ark.cn-beijing.volces.com`
   - 新加坡区域: `ark.ap-singapore-1.volces.com`
2. 检查网络连接
3. 确认防火墙设置

#### 问题4: Bot状态问题 (404 Not Found)
**症状**: Bot ID正确但仍返回404
**可能原因**:
1. Bot未发布或已停用
2. Bot在不同的区域
3. API密钥权限不足
**解决**:
1. 在火山引擎控制台检查Bot状态
2. 确保Bot已发布且处于活跃状态
3. 检查API密钥的权限范围

### 📝 配置示例

完整的环境变量配置示例：

```bash
# 火山引擎配置
OPENAI_API_KEY=your-volcengine-api-key-here
OPENAI_API_BASE=https://ark.cn-beijing.volces.com/api/v3/bots/
OPENAI_MODEL=bot-20250404114220-z2xsd

# 其他配置
NEXT_PUBLIC_USE_USER_KEY=false
REQUEST_TIMEOUT=30000
MAX_TOKENS=2000
```

### 🚀 部署到 Vercel

1. 在 Vercel 项目设置中添加环境变量
2. 确保所有变量都正确设置
3. 重新部署项目
4. 使用测试端点验证配置

### 📚 相关文档

- [火山引擎 Ark API 文档](https://www.volcengine.com/docs/82379)
- [项目调试指南](DEBUG_GUIDE.md)
- [Vercel 部署指南](VERCEL_DEPLOYMENT.md)

### 💡 提示

- 火山引擎的响应格式可能与OpenAI略有不同，项目已经处理了这些差异
- 如果遇到问题，请先使用 `/api/test` 端点进行测试
- 查看 Vercel Functions 日志获取详细的错误信息