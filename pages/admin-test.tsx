import { useState } from 'react';
import { useAuthState } from '../hooks/useSimpleAuth';
import LoginModal from '../components/LoginModal';

export default function AdminTest() {
  const { user, isLoading, logout } = useAuthState();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (isLoading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">管理员认证测试</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">✅ 已登录</h2>
            <div className="text-sm text-green-700">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>邮箱:</strong> {user.email}</p>
              <p><strong>用户名:</strong> {user.username}</p>
              <p><strong>管理员:</strong> {user.isAdmin ? '是' : '否'}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            退出登录
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">🔐 未登录</h2>
            <p className="text-sm text-blue-700">
              请使用管理员验证码登录系统
            </p>
          </div>
          
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            管理员登录
          </button>
        </div>
      )}

      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">📋 使用说明：</h3>
        <ol className="text-sm text-gray-700 space-y-1">
          <li>1. 点击&quot;管理员登录&quot;按钮</li>
          <li>2. 在弹窗中点击&quot;生成验证码&quot;</li>
          <li>3. 查看服务器日志获取6位验证码</li>
          <li>4. 输入验证码完成登录</li>
        </ol>
        
        <div className="mt-3 text-xs text-gray-600">
          <p><strong>Vercel:</strong> Dashboard → Functions → 查看日志</p>
          <p><strong>本地开发:</strong> 查看控制台输出</p>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={(user) => {
          console.log('登录成功:', user);
        }}
      />
    </div>
  );
}