import { useState } from 'react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';

export default function InitDB() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const initializeDatabase = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-init-key': 'dev-init-key'
        },
        body: JSON.stringify({ initKey: 'dev-init-key' })
      });

      const data = await response.json();

      if (response.ok) {
        setResult('✅ 数据库初始化成功！\n\n默认管理员账户：\n邮箱：admin@example.com\n用户名：admin\n密码：admin123');
        toast.success('数据库初始化成功');
      } else {
        setResult(`❌ 初始化失败：${data.error}\n\n详情：${data.details || '未知错误'}`);
        toast.error('数据库初始化失败');
      }
    } catch (error) {
      setResult(`❌ 网络错误：${error}`);
      toast.error('网络错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>数据库初始化 - Weekly Report GPT</title>
      </Head>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            数据库初始化
          </h1>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    注意事项
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      此操作将创建数据库表并初始化默认管理员账户。
                      请确保已正确配置 Vercel Postgres 数据库。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={initializeDatabase}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  初始化中...
                </>
              ) : (
                '初始化数据库'
              )}
            </button>

            {result && (
              <div className="mt-4">
                <pre className="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {result}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-transparent border-none cursor-pointer"
            >
              ← 返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}