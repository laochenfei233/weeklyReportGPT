// 邮箱服务 - 使用简单的模拟发送（生产环境需要配置真实的邮箱服务）

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// 模拟发送邮件（开发环境）
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // 在开发环境中，我们只是打印到控制台
    console.log('📧 Email would be sent:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Content:', options.html);
    
    // 模拟发送延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Send email error:', error);
    return false;
  }
}

// 发送验证码邮件
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const subject = 'Weekly Report GPT - 邮箱验证码';
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Weekly Report GPT</h1>
        <p style="color: #6b7280; margin: 5px 0;">智能周报生成助手</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 30px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">邮箱验证</h2>
        <p style="color: #4b5563; margin-bottom: 30px; line-height: 1.6;">
          感谢您注册 Weekly Report GPT！请使用以下验证码完成邮箱验证：
        </p>
        
        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
          <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${code}</span>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          验证码有效期为 10 分钟，请及时使用。
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px;">
          如果您没有注册 Weekly Report GPT，请忽略此邮件。
        </p>
      </div>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
}

// 发送欢迎邮件
export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
  const subject = 'Welcome to Weekly Report GPT! 🎉';
  const displayName = username || email.split('@')[0];
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Weekly Report GPT</h1>
        <p style="color: #6b7280; margin: 5px 0;">智能周报生成助手</p>
      </div>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 30px;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">欢迎加入！</h2>
        <p style="color: #4b5563; margin-bottom: 20px; line-height: 1.6;">
          Hi ${displayName}，
        </p>
        <p style="color: #4b5563; margin-bottom: 20px; line-height: 1.6;">
          恭喜您成功注册 Weekly Report GPT！现在您可以享受以下功能：
        </p>
        
        <ul style="color: #4b5563; line-height: 1.8; margin: 20px 0; padding-left: 20px;">
          <li>每日免费使用 10,000 tokens</li>
          <li>智能生成专业周报</li>
          <li>支持多种写作风格</li>
          <li>Markdown 格式输出</li>
          <li>个人使用统计</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            开始使用
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px;">
          如有任何问题，请随时联系我们。祝您使用愉快！
        </p>
      </div>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
}

// 生产环境邮箱配置示例（需要配置真实的邮箱服务）
/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@example.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Send email error:', error);
    return false;
  }
}
*/