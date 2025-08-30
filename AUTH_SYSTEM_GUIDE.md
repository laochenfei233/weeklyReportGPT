# 认证系统使用指南

本项目已集成完整的用户认证系统，支持邮箱验证、用户名/邮箱登录等功能。

## 🚀 主要功能

### 用户注册
- ✅ **邮箱验证** - 注册时需要邮箱验证码
- ✅ **用户名支持** - 支持自定义用户名
- ✅ **密码强度验证** - 至少6位，包含字母和数字
- ✅ **重复检查** - 防止邮箱和用户名重复注册

### 用户登录
- ✅ **多种登录方式** - 支持邮箱或用户名登录
- ✅ **安全认证** - JWT token + HttpOnly Cookie
- ✅ **会话管理** - 7天有效期，自动续期

### 邮箱系统
- ✅ **验证码发送** - 6位数字验证码，10分钟有效
- ✅ **欢迎邮件** - 注册成功后自动发送
- ✅ **邮件模板** - 美观的HTML邮件模板

## 📋 使用步骤

### 1. 配置数据库

首先需要配置 Vercel Postgres 数据库：

1. 在 Vercel 项目中添加 Postgres 数据库
2. 数据库连接信息会自动添加到环境变量中
3. 访问 `/init-db` 页面初始化数据库表

### 2. 初始化数据库

访问 `http://localhost:3000/init-db` 页面：

1. 点击"初始化数据库"按钮
2. 系统会创建所需的数据库表
3. 自动创建默认管理员账户

### 3. 测试登录

使用默认管理员账户测试：

```
邮箱：admin@example.com
用户名：admin
密码：admin123
```

### 4. 用户注册流程

1. 用户点击"注册"
2. 输入邮箱地址，点击"获取验证码"
3. 查看控制台输出的验证码（开发环境）
4. 输入验证码、用户名、密码
5. 完成注册并自动登录

## 🗄️ 数据库结构

### users 表
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  daily_token_usage INTEGER DEFAULT 0,
  last_usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### email_verifications 表
```sql
CREATE TABLE email_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### token_usage 表
```sql
CREATE TABLE token_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE DEFAULT CURRENT_DATE,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API 接口

### 认证相关
- `POST /api/auth/send-verification` - 发送邮箱验证码
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 数据库管理
- `POST /api/init-db` - 初始化数据库

## 📧 邮箱配置

### 开发环境
开发环境中，邮件内容会输出到控制台，无需配置真实邮箱服务。

### 生产环境
在生产环境中，需要配置以下环境变量：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourapp.com
```

然后取消注释 `lib/email.ts` 中的生产环境代码。

## 🔐 安全特性

### 密码安全
- 使用 bcrypt 进行密码哈希
- 12轮加密强度
- 密码强度验证

### JWT 安全
- HttpOnly Cookie 存储
- 7天有效期
- 安全的签名密钥

### 验证码安全
- 6位随机数字
- 10分钟有效期
- 使用后自动删除

## 🎯 用户权限

### 普通用户
- 每日10,000 tokens限制
- 基本功能访问
- 个人统计查看

### 管理员用户
- 无token限制
- 完整功能访问
- 系统管理权限

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 Vercel Postgres 配置
   - 确认环境变量正确设置

2. **验证码收不到**
   - 开发环境查看控制台输出
   - 生产环境检查邮箱配置

3. **登录失败**
   - 确认用户名/邮箱正确
   - 检查密码是否正确
   - 确认账户已激活

### 调试模式

在开发环境中，所有错误信息会输出到控制台，便于调试。

## 📱 前端组件

### LoginModal 组件
- 支持登录/注册切换
- 实时表单验证
- 美观的UI设计
- 响应式布局

### 使用方法
```tsx
import LoginModal from '../components/LoginModal';

<LoginModal
  isOpen={showLoginModal}
  onClose={() => setShowLoginModal(false)}
  onSuccess={(user) => {
    console.log('登录成功:', user);
  }}
/>
```

## 🔄 状态管理

使用 `useAuthState` Hook 管理用户状态：

```tsx
import { useAuthState } from '../hooks/useAuth';

const { user, stats, isLoading, refreshUser } = useAuthState();
```

## 📊 使用统计

系统会自动记录用户的token使用情况：
- 每日使用量
- 总使用量
- 最近7天趋势
- 使用限制检查

---

*本认证系统提供了完整的用户管理功能，支持现代Web应用的所有认证需求。如有问题，请查看相关API文档或联系开发团队。*