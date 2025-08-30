import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

// 生成JWT密钥（如果不存在）
export function getJWTSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  
  // 在运行时生成临时密钥（仅用于开发）
  const crypto = require('crypto');
  return crypto.randomBytes(64).toString('hex');
}

// 生成JWT token
export function generateToken(user: User): string {
  const secret = getJWTSecret();
  return jwt.sign(user, secret, { expiresIn: '7d' });
}

// 验证JWT token
export function verifyToken(token: string): User | null {
  try {
    const secret = getJWTSecret();
    return jwt.verify(token, secret) as User;
  } catch (error) {
    return null;
  }
}

// 从请求中获取用户信息
export function getUserFromRequest(req: NextApiRequest): User | null {
  const token = req.cookies.auth_token;
  if (!token) return null;
  
  return verifyToken(token);
}

// 生成验证码
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}