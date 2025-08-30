import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查用户登录状态
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 管理员登录
  const adminLogin = async (code: string) => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_code', code }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        return data.user;
      } else {
        throw new Error(data.error || '登录失败');
      }
    } catch (error) {
      throw error;
    }
  };

  // 请求验证码
  const requestVerificationCode = async () => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_code' })
      });

      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || '请求验证码失败');
      }
    } catch (error) {
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await fetch('/api/auth/admin-login', {
        method: 'DELETE',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 刷新用户信息
  const refreshUser = () => {
    checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    isLoading,
    adminLogin,
    requestVerificationCode,
    logout,
    refreshUser
  };
}