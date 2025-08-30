import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface InitResult {
  jwtSecret: string | null;
  status: string;
  message: string;
  warnings: string[];
}

export default function AutoInit() {
  const [initResult, setInitResult] = useState<InitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAutoInit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auto-init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setInitResult(data.data);
      } else {
        setError(data.error || '初始化失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动运行初始化
  useEffect(() => {
    runAutoInit();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>自动初始化 - Weekly Report</title>
      </Head>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">🚀 自动初始化</h1>
            <p className="text-gray-600">首次部署自动配置</p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">正在初始化...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">初始化失败</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {initResult && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">✅ {initResult.message}</h3>
                  </div>
                </div>
              </div>

              {initResult.jwtSecret && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">🔐 生成的JWT密钥</h3>
                  <div className="bg-white p-3 rounded border font-mono text-xs break-all">
                    {initResult.jwtSecret}
                  </div>
                  <div className="mt-3 text-sm text-blue-700">
                    <p className="font-medium">配置步骤：</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>复制上面的密钥</li>
                      <li>进入 Vercel Dashboard</li>
                      <li>Settings → Environment Variables</li>
                      <li>添加变量: JWT_SECRET</li>
                      <li>粘贴密钥值并保存</li>
                      <li>重新部署项目</li>
                    </ol>
                  </div>
                </div>
              )}

              {initResult.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">⚠️ 注意事项</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {initResult.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={runAutoInit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  🔄 重新初始化
                </button>
                <Link
                  href="/"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  🏠 返回首页
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}