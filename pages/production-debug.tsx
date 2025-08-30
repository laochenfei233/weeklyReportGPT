import { useState } from 'react';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'loading' | 'warning';
  message: string;
  details?: any;
}

export default function ProductionDebug() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testPrompt, setTestPrompt] = useState('测试周报生成功能');

  const updateResult = (test: string, status: TestResult['status'], message: string, details?: any) => {
    setResults(prev => {
      const existing = prev.find(r => r.test === test);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.details = details;
        return [...prev];
      }
      return [...prev, { test, status, message, details }];
    });
  };

  const runFullDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);

    // 测试1: 环境变量检查
    updateResult('环境变量', 'loading', '检查中...');
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-env' })
      });
      const data = await response.json();
      
      if (response.ok) {
        updateResult('环境变量', 'success', '环境变量配置正常', data);
      } else {
        updateResult('环境变量', 'error', data.error || '环境变量检查失败', data);
      }
    } catch (error) {
      updateResult('环境变量', 'error', '网络请求失败', error);
    }

    // 测试2: API连接测试
    updateResult('API连接', 'loading', '测试中...');
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-api' })
      });
      const data = await response.json();
      
      if (response.ok) {
        updateResult('API连接', 'success', 'API连接正常', data);
      } else {
        updateResult('API连接', 'error', data.error || 'API连接失败', data);
      }
    } catch (error) {
      updateResult('API连接', 'error', '网络请求失败', error);
    }

    // 测试3: JWT密钥检查
    updateResult('JWT密钥', 'loading', '检查中...');
    try {
      const response = await fetch('/api/auto-init');
      const data = await response.json();
      
      if (response.ok) {
        updateResult('JWT密钥', 'success', 'JWT密钥正常', data);
      } else {
        updateResult('JWT密钥', 'warning', 'JWT密钥可能有问题', data);
      }
    } catch (error) {
      updateResult('JWT密钥', 'error', 'JWT检查失败', error);
    }

    // 测试4: 生成API测试
    updateResult('生成功能', 'loading', '测试中...');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: testPrompt,
          api_key: 'test-key' // 这会被环境变量覆盖
        }),
        credentials: 'include'
      });

      if (response.ok) {
        // 尝试读取流式响应
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let result = '';
          let chunks = 0;
          
          try {
            while (chunks < 5) { // 只读取前5个chunk
              const { value, done } = await reader.read();
              if (done) break;
              result += decoder.decode(value);
              chunks++;
            }
            reader.cancel(); // 取消剩余的流
            
            updateResult('生成功能', 'success', '生成功能正常', { 
              preview: result.substring(0, 100) + '...',
              chunks 
            });
          } catch (streamError) {
            updateResult('生成功能', 'error', '流式响应读取失败', streamError);
          }
        } else {
          updateResult('生成功能', 'warning', '响应体为空');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: '无法解析错误响应' }));
        updateResult('生成功能', 'error', `生成失败 (${response.status})`, errorData);
      }
    } catch (error) {
      updateResult('生成功能', 'error', '生成请求失败', error);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'loading': return '🔄';
      default: return '❓';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'loading': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Head>
        <title>生产环境诊断工具</title>
      </Head>

      <Toaster position="top-center" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">生产环境诊断工具</h1>
        <p className="text-gray-600">
          这个工具可以帮助诊断生产环境中&quot;服务器繁忙&quot;的问题
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          测试提示词
        </label>
        <input
          type="text"
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入测试用的工作内容"
        />
      </div>

      <div className="mb-6">
        <button
          onClick={runFullDiagnostic}
          disabled={isRunning}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? '诊断中...' : '开始完整诊断'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">诊断结果</h2>
          
          {results.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <span>{getStatusIcon(result.status)}</span>
                  {result.test}
                </h3>
                <span className="text-sm opacity-75">
                  {result.status === 'loading' ? '进行中' : '完成'}
                </span>
              </div>
              
              <p className="text-sm mb-2">{result.message}</p>
              
              {result.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium mb-1">详细信息</summary>
                  <pre className="bg-white bg-opacity-50 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">常见问题解决方案</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>API密钥问题</strong>: 检查Vercel环境变量中的OPENAI_API_KEY是否正确设置</li>
          <li>• <strong>网络超时</strong>: 可能是API服务响应慢，尝试增加REQUEST_TIMEOUT环境变量</li>
          <li>• <strong>模型不可用</strong>: 检查OPENAI_MODEL环境变量，确保使用可用的模型</li>
          <li>• <strong>JWT问题</strong>: 访问 /auto-init 页面重新生成JWT密钥</li>
          <li>• <strong>Edge Runtime错误</strong>: 检查Vercel Functions日志获取详细错误信息</li>
        </ul>
      </div>
    </div>
  );
}