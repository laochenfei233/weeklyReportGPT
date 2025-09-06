import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';
import { API_PROVIDERS, validateAPIKey, getAPIKeyInfo } from '../utils/apiConfig';
import { useAuthState } from '../hooks/useAuth';
import { useTranslations } from 'next-intl';

interface UserSettings {
  useCustomConfig: boolean;
  customApiKey: string;
  customApiBase: string;
  customModel: string;
}

export default function Settings() {
  const { user, isLoading: authLoading } = useAuthState();
  const t = useTranslations('Settings');
  const [settings, setSettings] = useState<UserSettings>({
    useCustomConfig: false,
    customApiKey: '',
    customApiBase: 'https://api.openai.com/v1',
    customModel: 'gpt-3.5-turbo'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');

  // 从localStorage加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        
        // 检测当前使用的提供商
        const provider = Object.entries(API_PROVIDERS).find(([key, provider]) => 
          provider.baseURL === parsed.customApiBase
        );
        if (provider) {
          setSelectedProvider(provider[0]);
        }
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = API_PROVIDERS[providerId];
    if (provider && provider.baseURL) {
      setSettings(prev => ({
        ...prev,
        customApiBase: provider.baseURL,
        customModel: provider.models[0] || 'gpt-3.5-turbo'
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // 验证API密钥格式
      if (settings.useCustomConfig && settings.customApiKey) {
        const isValid = validateAPIKey(settings.customApiKey, settings.customApiBase);
        if (!isValid) {
          const keyInfo = getAPIKeyInfo(settings.customApiKey, settings.customApiBase);
          toast.error(`${t('keyFormatError')}${keyInfo.format}`);
          setIsLoading(false);
          return;
        }
      }

      // 保存到localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      toast.success(t('settingsSaved'));
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error(t('settingsSaveError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      useCustomConfig: false,
      customApiKey: '',
      customApiBase: 'https://api.openai.com/v1',
      customModel: 'gpt-3.5-turbo'
    });
    setSelectedProvider('openai');
    localStorage.removeItem('userSettings');
    toast.success(t('settingsResetSuccess'));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>{t('title')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold mb-8">{t('pageTitle')}</h1>
          
          {/* 用户状态显示 */}
          {user && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {t('currentUser')}: {user.email}
                {user.isAdmin && <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">{t('admin')}</span>}
              </p>
              {user.isAdmin ? (
                <p className="text-xs text-green-600 mt-1">{t('adminNoLimit')}</p>
              ) : (
                <p className="text-xs text-orange-600 mt-1">{t('userLimit')}</p>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 text-left">
            {/* 使用自定义配置开关 */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.useCustomConfig}
                  onChange={(e) => setSettings(prev => ({ ...prev, useCustomConfig: e.target.checked }))}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-lg font-medium">{t('useCustomConfig')}</span>
              </label>
              <p className="text-sm text-gray-600 mt-2">
                {t('useCustomConfigDesc')}
              </p>
            </div>

            {settings.useCustomConfig && (
              <div className="space-y-6 border-t pt-6">
                {/* API提供商选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('apiProvider')}
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => handleProviderChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(API_PROVIDERS).map(([key, provider]) => (
                      <option key={key} value={key}>
                        {provider.name} - {provider.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* API Base URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('apiBaseUrl')}
                  </label>
                  <input
                    type="url"
                    value={settings.customApiBase}
                    onChange={(e) => setSettings(prev => ({ ...prev, customApiBase: e.target.value }))}
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('apiKey')}
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={settings.customApiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, customApiKey: e.target.value }))}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showApiKey ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {settings.customApiKey && (
                    <div className="mt-2">
                      {(() => {
                        const keyInfo = getAPIKeyInfo(settings.customApiKey, settings.customApiBase);
                        return (
                          <p className={`text-xs ${keyInfo.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {keyInfo.isValid ? t('keyFormatCorrect') : t('keyFormatIncorrect')}
                            <br />
                            {t('provider')}: {keyInfo.provider}
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('model')}
                  </label>
                  <select
                    value={settings.customModel}
                    onChange={(e) => setSettings(prev => ({ ...prev, customModel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {API_PROVIDERS[selectedProvider]?.models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex space-x-4 mt-8 pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('savingSettings') : t('saveSettings')}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                {t('resetSettings')}
              </button>
            </div>
          </div>

          {/* 说明信息 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <h3 className="font-medium mb-2">{t('instructions')}</h3>
            <ul className="space-y-1 text-left">
              <li>• {t('instructionsList.adminNoLimit')}</li>
              <li>• {t('instructionsList.userLimit')}</li>
              <li>• {t('instructionsList.customApi')}</li>
              <li>• {t('instructionsList.providers')}</li>
              <li>• {t('instructionsList.localSettings')}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}