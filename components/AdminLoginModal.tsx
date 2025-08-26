import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleGenerateCode = async () => {
    setGenerating(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ 验证码已生成！请查看服务器日志（Vercel Functions 或控制台）');
      } else {
        setMessage('❌ ' + (data.error || '生成验证码失败'));
      }
    } catch (error) {
      setMessage('❌ 网络错误，请重试');
    } finally {
      setGenerating(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setMessage('❌ 请输入验证码');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code: code.trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        login(data.user, data.token);
        setMessage('✅ 登录成功！');
        setTimeout(() => {
          onClose();
          setCode('');
          setMessage('');
        }, 1000);
      } else {
        setMessage('❌ ' + (data.error || '登录失败'));
      }
    } catch (error) {
      setMessage('❌ 网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">管理员登录</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 生成验证码 */}
          <div>
            <button
              onClick={handleGenerateCode}
              disabled={generating}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {generating ? '生成中...' : '🔐 生成验证码'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              点击生成验证码，然后在服务器日志中查看6位数字验证码
            </p>
          </div>

          {/* 输入验证码 */}
          <form onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                验证码
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="输入6位验证码"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? '验证中...' : '🚀 登录'}
            </button>
          </form>

          {/* 消息显示 */}
          {message && (
            <div className={`p-3 rounded text-sm ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* 帮助信息 */}
          <div className="bg-gray-50 p-3 rounded text-sm">
            <h4 className="font-medium mb-2">📋 如何查看验证码：</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>Vercel:</strong> Dashboard → Functions → 查看日志</li>
              <li>• <strong>本地开发:</strong> 查看控制台输出</li>
              <li>• <strong>其他平台:</strong> 查看应用日志</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}