import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '', // 用于登录时的邮箱或用户名
    email: '',      // 用于注册时的邮箱
    username: '',   // 用于注册时的用户名
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });

  const handleSendVerification = async () => {
    if (!formData.email) {
      toast.error('请输入邮箱地址');
      return;
    }

    setVerificationLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('验证码已发送到您的邮箱');
        setIsVerificationSent(true);
      } else {
        toast.error(data.error || '发送验证码失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // 登录
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('登录成功');
          onSuccess(data.user);
          onClose();
          resetForm();
        } else {
          toast.error(data.error || '登录失败');
        }
      } else {
        // 注册
        if (!isVerificationSent) {
          toast.error('请先获取邮箱验证码');
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            verificationCode: formData.verificationCode
          })
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('注册成功，欢迎使用！');
          onSuccess(data.user);
          onClose();
          resetForm();
        } else {
          toast.error(data.error || '注册失败');
        }
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      identifier: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      verificationCode: ''
    });
    setIsVerificationSent(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {isLogin ? '登录账号' : '注册账号'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isLogin ? (
                    // 登录表单
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          邮箱地址或用户名
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.identifier}
                          onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="请输入邮箱地址或用户名"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          密码
                        </label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="请输入密码"
                        />
                      </div>
                    </>
                  ) : (
                    // 注册表单
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          邮箱地址
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入邮箱地址"
                          />
                          <button
                            type="button"
                            onClick={handleSendVerification}
                            disabled={verificationLoading || !formData.email}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {verificationLoading ? '发送中...' : '获取验证码'}
                          </button>
                        </div>
                      </div>

                      {isVerificationSent && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            邮箱验证码
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.verificationCode}
                            onChange={(e) => setFormData(prev => ({ ...prev, verificationCode: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入6位验证码"
                            maxLength={6}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            验证码已发送到您的邮箱，有效期10分钟
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          用户名
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="请输入用户名"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          密码
                        </label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="请输入密码"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          确认密码
                        </label>
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="请再次输入密码"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
                    </button>

                    <div className="space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
                      </button>
                    </div>
                  </div>
                </form>

                {!isLogin && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-800">
                      • 密码至少6个字符<br/>
                      • 需要包含字母和数字<br/>
                      • 需要邮箱验证<br/>
                      • 注册后每日可免费使用1万token
                    </p>
                  </div>
                )}

                {isLogin && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-xs text-green-800">
                      💡 <strong>测试账号：</strong><br/>
                      邮箱：admin@example.com<br/>
                      密码：admin123
                    </p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}