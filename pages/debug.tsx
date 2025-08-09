import { useState } from 'react';
import Head from 'next/head';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  data: any;
  error?: string;
}

export default function DebugPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, method: string = 'GET') => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      return {
        endpoint,
        method,
        status: response.status,
        data,
        error: response.ok ? undefined : data.error || 'Unknown error'
      };
    } catch (error) {
      return {
        endpoint,
        method,
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    const tests = [
      { endpoint: '/api/health', method: 'GET' },
      { endpoint: '/api/validate-key', method: 'GET' },
      { endpoint: '/api/test-endpoint', method: 'GET' },
      { endpoint: '/api/test', method: 'POST' },
    ];

    const testResults: TestResult[] = [];

    for (const test of tests) {
      const result = await testEndpoint(test.endpoint, test.method);
      testResults.push(result);
      setResults([...testResults]);
    }

    setLoading(false);
  };

  const testGenerate = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: '测试周报生成：完成了项目调试工作'
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let content = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            content += decoder.decode(value);
          }
        }

        setResults(prev => [...prev, {
          endpoint: '/api/generate',
          method: 'POST',
          status: response.status,
          data: { content: content.substring(0, 200) + '...' },
        }]);
      } else {
        const errorData = await response.json();
        setResults(prev => [...prev, {
          endpoint: '/api/generate',
          method: 'POST',
          status: response.status,
          data: errorData,
          error: errorData.error
        }]);
      }
    } catch (error) {
      setResults(prev => [...prev, {
        endpoint: '/api/generate',
        method: 'POST',
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Network error'
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>API Debug - Weekly Report</title>
      </Head>
      
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API 调试工具</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">快速测试</h2>
          <div className="space-x-4">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              {loading ? '测试中...' : '运行基础测试'}
            </button>
            <button
              onClick={testGenerate}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              测试周报生成
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {result.method} {result.endpoint}
                </h3>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  result.status >= 200 && result.status < 300
                    ? 'bg-green-100 text-green-800'
                    : result.status >= 400
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {result.status || 'ERROR'}
                </span>
              </div>
              
              {result.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-red-800 font-medium">错误:</p>
                  <p className="text-red-700">{result.error}</p>
                </div>
              )}
              
              <div className="bg-gray-50 rounded p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">响应数据:</p>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            点击上方按钮开始测试 API 端点
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">使用说明</h3>
          <div className="text-blue-800 space-y-2">
            <p><strong>基础测试</strong>: 检查健康状态、验证API密钥、测试API连接</p>
            <p><strong>周报生成测试</strong>: 测试实际的周报生成功能</p>
            <p><strong>状态码说明</strong>:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>200-299: 成功</li>
              <li>400-499: 客户端错误（配置问题）</li>
              <li>500-599: 服务器错误（API问题）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}