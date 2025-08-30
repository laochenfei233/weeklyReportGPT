import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuthState } from '../hooks/useAuth';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    locale,
    setLocale,
    autoSave,
    setAutoSave,
    showLineNumbers,
    setShowLineNumbers
  } = useSettings();

  const { user, adminLogin, requestVerificationCode, logout } = useAuthState();
  const [activeTab, setActiveTab] = useState<'appearance' | 'editor' | 'general'>('appearance');
  const [verificationCode, setVerificationCode] = useState('');
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 管理员登录功能
  const handleRequestCode = async () => {
    setIsRequestingCode(true);
    try {
      const result = await requestVerificationCode();
      toast.success('验证码已生成，请查看Vercel Function日志');
      toast(result.hint, { duration: 5000 });
    } catch (error: any) {
      toast.error(error.message || '请求验证码失败');
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleLogin = async () => {
    if (!verificationCode.trim()) {
      toast.error('请输入验证码');
      return;
    }

    setIsLoggingIn(true);
    try {
      const user = await adminLogin(verificationCode);
      toast.success('登录成功');
      setVerificationCode('');
    } catch (error: any) {
      toast.error(error.message || '登录失败');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('已退出登录');
    } catch (error) {
      toast.error('退出登录失败');
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'appearance', name: locale === 'zh' ? '外观' : 'Appearance', icon: '🎨' },
    { id: 'editor', name: locale === 'zh' ? '编辑器' : 'Editor', icon: '📝' },
    { id: 'general', name: locale === 'zh' ? '通用' : 'General', icon: '⚙️' }
  ];

  const themeOptions = [
    { value: 'light', label: locale === 'zh' ? '浅色' : 'Light', icon: '☀️' },
    { value: 'dark', label: locale === 'zh' ? '深色' : 'Dark', icon: '🌙' },
    { value: 'auto', label: locale === 'zh' ? '跟随系统' : 'Auto', icon: '🔄' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: locale === 'zh' ? '小' : 'Small' },
    { value: 'medium', label: locale === 'zh' ? '中' : 'Medium' },
    { value: 'large', label: locale === 'zh' ? '大' : 'Large' }
  ];

  const fontFamilyOptions = [
    { value: 'system', label: locale === 'zh' ? '系统字体' : 'System Font' },
    { value: 'serif', label: locale === 'zh' ? '衬线字体' : 'Serif Font' },
    { value: 'mono', label: locale === 'zh' ? '等宽字体' : 'Monospace Font' }
  ];

  const languageOptions = [
    { value: 'zh', label: '中文', flag: '🇨🇳' },
    { value: 'en', label: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {locale === 'zh' ? '设置' : 'Settings'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {locale === 'zh' ? '主题' : 'Theme'}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${theme === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {locale === 'zh' ? '字体大小' : 'Font Size'}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFontSize(option.value as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${fontSize === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        <div className={`font-medium text-gray-900 dark:text-white ${option.value === 'small' ? 'text-sm' :
                            option.value === 'large' ? 'text-lg' : 'text-base'
                          }`}>
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {locale === 'zh' ? '字体族' : 'Font Family'}
                  </h3>
                  <div className="space-y-2">
                    {fontFamilyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFontFamily(option.value as any)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${fontFamily === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        <div className={`font-medium text-gray-900 dark:text-white ${option.value === 'serif' ? 'font-serif' :
                            option.value === 'mono' ? 'font-mono' : 'font-sans'
                          }`}>
                          {option.label}
                        </div>
                        <div className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${option.value === 'serif' ? 'font-serif' :
                            option.value === 'mono' ? 'font-mono' : 'font-sans'
                          }`}>
                          {locale === 'zh' ? '示例文本 Example Text' : 'Sample Text 示例文本'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {locale === 'zh' ? '编辑器选项' : 'Editor Options'}
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {locale === 'zh' ? '自动保存' : 'Auto Save'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {locale === 'zh' ? '自动保存输入的内容' : 'Automatically save your input'}
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={showLineNumbers}
                        onChange={(e) => setShowLineNumbers(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {locale === 'zh' ? '显示行号' : 'Show Line Numbers'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {locale === 'zh' ? '在文本区域显示行号' : 'Display line numbers in text areas'}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {locale === 'zh' ? '语言' : 'Language'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLocale(option.value as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${locale === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        <div className="text-2xl mb-2">{option.flag}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 管理员登录板块 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {locale === 'zh' ? '管理员' : 'Administrator'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    {user ? (
                      // 已登录状态
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            管
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {locale === 'zh' ? '管理员已登录' : 'Administrator Logged In'}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">
                              {locale === 'zh' ? '✅ 无使用限制' : '✅ Unlimited Usage'}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          {locale === 'zh' ? '退出登录' : 'Logout'}
                        </button>
                      </div>
                    ) : (
                      // 未登录状态
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {locale === 'zh' ? '管理员登录后可无限制使用所有功能' : 'Administrator login for unlimited access to all features'}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-200">
                          <div className="font-medium mb-1">
                            {locale === 'zh' ? '如何获取验证码：' : 'How to get verification code:'}
                          </div>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>{locale === 'zh' ? '点击"获取验证码"按钮' : 'Click "Get Code" button'}</li>
                            <li>{locale === 'zh' ? '前往 Vercel Dashboard → Functions' : 'Go to Vercel Dashboard → Functions'}</li>
                            <li>{locale === 'zh' ? '找到 "/api/auth/admin-login" 的请求日志' : 'Find "/api/auth/admin-login" request logs'}</li>
                            <li>{locale === 'zh' ? '在日志中查看验证码' : 'View verification code in logs'}</li>
                          </ol>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={handleRequestCode}
                            disabled={isRequestingCode}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            {isRequestingCode
                              ? (locale === 'zh' ? '生成中...' : 'Generating...')
                              : (locale === 'zh' ? '获取验证码' : 'Get Verification Code')
                            }
                          </button>

                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              placeholder={locale === 'zh' ? '输入6位验证码' : 'Enter 6-digit code'}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                              maxLength={6}
                            />
                            <button
                              onClick={handleLogin}
                              disabled={isLoggingIn || !verificationCode.trim()}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                              {isLoggingIn
                                ? (locale === 'zh' ? '登录中...' : 'Logging in...')
                                : (locale === 'zh' ? '登录' : 'Login')
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {locale === 'zh' ? '关于' : 'About'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      <div>
                        <strong>{locale === 'zh' ? '版本' : 'Version'}:</strong> 1.0.0
                      </div>
                      <div>
                        <strong>{locale === 'zh' ? '构建时间' : 'Build Time'}:</strong> {new Date().toLocaleDateString()}
                      </div>
                      <div>
                        <strong>{locale === 'zh' ? '描述' : 'Description'}:</strong> {locale === 'zh' ? '智能周报生成工具' : 'Intelligent Weekly Report Generator'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {locale === 'zh' ? '完成' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;