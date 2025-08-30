# 管理员登录指南

## ⚙️ 环境配置

在使用管理员登录功能前，请确保已正确配置环境变量：

```bash
# 必需配置
JWT_SECRET=your-jwt-secret-key-change-in-production
SESSION_DURATION_DAYS=14
```

**生成 JWT_SECRET：**
```bash
# 使用 npm 脚本（推荐）
npm run generate-jwt-secret

# 或直接使用脚本
node scripts/generate-jwt-secret.js

# 或使用 Node.js 命令
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**配置步骤：**
1. 运行 `npm run generate-jwt-secret`
2. 复制生成的密钥
3. 替换 `.env` 文件中的 `JWT_SECRET` 值
4. 在 Vercel 环境变量中设置相同的值

## 🔐 验证码获取方式

本系统采用**服务器日志验证码**的方式进行管理员身份验证，无需配置邮件服务或数据库。

### 📋 登录步骤

1. **点击"管理"按钮** - 在主页面点击管理入口
2. **选择注册或登录** - 首次使用需要注册管理员账户
3. **填写邮箱和密码** - 输入管理员邮箱和密码
4. **获取验证码** - 点击"获取验证码"按钮
5. **查看服务器日志** - 在部署平台查看验证码
6. **输入验证码** - 将日志中的6位验证码输入到表单中
7. **完成登录** - 成功登录后享受无限制token使用

### 🔍 在 Vercel 中查看验证码

#### 方法1: Vercel Dashboard
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 **"Functions"** 标签
4. 找到最新的函数调用记录
5. 点击查看日志详情
6. 查找带有 `🔐 管理员验证码` 标记的日志

#### 方法2: Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 查看实时日志
vercel logs --follow
```

### 📱 验证码格式示例

在日志中你会看到类似这样的输出：

```
============================================================
🔐 管理员验证码 - ADMIN VERIFICATION CODE
============================================================
📧 邮箱: admin@example.com
🔢 验证码: 123456
⏰ 生成时间: 2024/1/1 12:00:00
⏳ 有效期: 10分钟
🔍 请在 Vercel Functions 日志中查看此验证码
============================================================
```

### ⚠️ 注意事项

1. **验证码有效期** - 每个验证码有效期为10分钟
2. **安全性** - 只有服务器管理员能查看日志
3. **一次性使用** - 每个验证码只能使用一次
4. **自动清理** - 过期验证码会自动从数据库清理

### 🔧 其他部署平台

#### Railway
1. 进入项目 Dashboard
2. 点击 **"Deployments"**
3. 选择最新部署
4. 查看 **"Logs"** 标签

#### Netlify
1. 进入项目 Dashboard  
2. 点击 **"Functions"** 标签
3. 查看函数执行日志

#### 自托管服务器
```bash
# 查看应用日志
pm2 logs your-app-name

# 或者查看系统日志
tail -f /var/log/your-app.log
```

### 💡 优势

- ✅ **无需邮件配置** - 不需要SMTP服务
- ✅ **安全可靠** - 只有服务器管理员能查看
- ✅ **成本低廉** - 无第三方服务费用
- ✅ **部署简单** - 开箱即用
- ✅ **调试友好** - 便于开发和测试

### 🚀 生产环境建议

如果需要更专业的解决方案，可以考虑：

1. **集成邮件服务** - 配置 SMTP 或第三方邮件API
2. **短信验证** - 集成短信验证码服务
3. **2FA应用** - 支持 Google Authenticator 等
4. **企业SSO** - 集成企业单点登录

但对于大多数场景，控制台日志验证码已经足够安全和便捷。