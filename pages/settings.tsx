import { useState, useEffect } from 'react';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface UserSettings {
  fontSize: 'small' | 'medium' | 'large';
  responseStyle: 'professional' | 'casual' | 'detailed' | 'concise';
  language: 'zh' | 'en';
  customModel: string;
  customApiBase: string;
  customApiKey: string;
  useCustomConfig: boolean;
}

const defaultSettings: UserSettings = {
  fontSize: 'medium',
  responseStyle: 'professional',
  language: 'zh',
  customModel: 'gpt-3.5-turbo',
  customApiBase: 'https://api.openai.com/v1',
  customApiKey: '',
  useCustomConfig: false
};

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // 保存设置
  const saveSettings = () => {
    setIsLoading(true);
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      toast.success('设置已保存');
      
      // 如果语言改变了，重新加载页面以应用新语言
      const currentLang = router.locale;
      if (settings.language !== currentLang) {
        router.push('/settings', '/settings', { locale: settings.language });
      }
    } catch (error) {
      toast.error('保存设置失败');
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置设置
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('userSettings');
    toast.success('设置已重置');
  };

  // 测试自定义配置
  const testCustomConfig = async () => {
    if (!settings.customApiKey || !settings.customApiBase) {
      toast.error('请先填写API密钥和基础URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/test-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: settings.customApiKey,
          apiBase: settings.customApiBase,
          model: settings.customModel
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('配置测试成功！');
      } else {
        toast.error(data.error || '配置测试失败');
      }
    } catch (error) {
      toast.error('网络请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  const fontSizeOptions = [
    { value: 'small', label: '小号', class: 'text-sm' },
    { value: 'medium', label: '中号', class: 'text-base' },
    { value: 'large', label: '大号', class: 'text-lg' }
  ];

  const responseStyleOptions = [
    { value: 'professional', label: '专业正式', description: '使用正式的商务语言' },
    { value: 'casual', label: '轻松随意', description: '使用轻松友好的语调' },
    { value: 'detailed', label: '详细完整', description: '提供详细的描述和分析' },
    { value: 'concise', label: '简洁明了', description: '简洁扼要，突出重点' }
  ];

  const languageOptions = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' }
  ];

  const presetModels = [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'deepseek-chat', label: 'DeepSeek Chat' },
    { value: 'moonshot-v1-8k', label: 'Moonshot v1 8K' },
    { value: 'glm-4', label: '智谱 GLM-4' }
  ];

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>用户设置 - Weekly Report GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">用户设置</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
            
            {/* 显示设置 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">显示设置</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    字体大小
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSettings(prev => ({ ...prev, fontSize: option.value as any }))}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          settings.fontSize === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className={option.class}>{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    语言设置
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSettings(prev => ({ ...prev, language: option.value as any }))}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          settings.language === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 回答风格 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">回答风格</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {responseStyleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSettings(prev => ({ ...prev, responseStyle: option.value as any }))}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      settings.responseStyle === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* 模型配置 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">模型配置</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="useCustomConfig"
                    checked={settings.useCustomConfig}
                    onChange={(e) => setSettings(prev => ({ ...prev, useCustomConfig: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useCustomConfig" className="text-sm font-medium text-gray-700">
                    使用自定义配置
                  </label>
                </div>

                {settings.useCustomConfig && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API 基础URL
                      </label>
                      <input
                        type="text"
                        value={settings.customApiBase}
                        onChange={(e) => setSettings(prev => ({ ...prev, customApiBase: e.target.value }))}
                        placeholder="https://api.openai.com/v1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        模型名称
                      </label>
                      <select
                        value={settings.customModel}
                        onChange={(e) => setSettings(prev => ({ ...prev, customModel: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {presetModels.map((model) => (
                          <option key={model.value} value={model.value}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={settings.customModel}
                        onChange={(e) => setSettings(prev => ({ ...prev, customModel: e.target.value }))}
                        placeholder="或输入自定义模型名称"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API 密钥
                      </label>
                      <input
                        type="password"
                        value={settings.customApiKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, customApiKey: e.target.value }))}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        API密钥仅保存在本地浏览器中，不会上传到服务器
                      </p>
                    </div>

                    <button
                      onClick={testCustomConfig}
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '测试中...' : '测试配置'}
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* 操作按钮 */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={resetSettings}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                重置设置
              </button>
              
              <div className="space-x-3">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveSettings}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '保存中...' : '保存设置'}
                </button>
              </div>
            </div>
          </div>

          {/* 预览区域 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">预览效果</h3>
            <div 
              className={`p-4 bg-gray-50 rounded-lg ${
                settings.fontSize === 'small' ? 'text-sm' :
                settings.fontSize === 'large' ? 'text-lg' : 'text-base'
              }`}
            >
              <p className="text-gray-700">
                这是一个示例文本，展示当前字体大小设置的效果。
                {settings.responseStyle === 'professional' && '将使用专业正式的语言风格生成周报。'}
                {settings.responseStyle === 'casual' && '将使用轻松随意的语言风格生成周报。'}
                {settings.responseStyle === 'detailed' && '将生成详细完整的周报内容。'}
                {settings.responseStyle === 'concise' && '将生成简洁明了的周报内容。'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}