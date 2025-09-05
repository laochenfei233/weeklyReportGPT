import { useState } from 'react';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  details?: any;
}

export default function Debug() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { theme } = useTheme();

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

  const runTests = async () => {
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

    // 测试3: 周报生成测试
    updateResult('周报生成', 'loading', '测试中...');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: '完成了项目调试功能的开发和测试工作' 
        })
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let result = '';
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value);
          }
        }
        
        updateResult('周报生成', 'success', '周报生成功能正常', { preview: result.substring(0, 100) + '...' });
      } else {
        const errorData = await response.json();
        updateResult('周报生成', 'error', errorData.error || '周报生成失败', errorData);
      }
    } catch (error) {
      updateResult('周报生成', 'error', '网络请求失败', error);
    }

    setIsRunning(false);
    toast.success('调试测试完成');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'loading': return '⏳';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'loading': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen py-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Head>
        <title>系统调试 - Weekly Report GPT</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className={`rounded-lg shadow-sm border p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h1 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>系统调试面板</h1>
          
          <div className="mb-6">
            <motion.button
              onClick={runTests}
              disabled={isRunning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-lg font-medium ${
                isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {isRunning ? '测试中...' : '开始系统测试'}
            </motion.button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">测试结果</h2>
              
              <AnimatePresence>
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`border rounded-lg p-4 mb-3 ${
                      theme === 'dark' 
                        ? 'border-gray-700' 
                        : 'border-gray-200'
                    }`}
                  >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {getStatusIcon(result.status)} {result.test}
                    </h3>
                    <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                      {result.status === 'loading' ? '测试中' : 
                       result.status === 'success' ? '通过' : '失败'}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${getStatusColor(result.status)} mb-2`}>
                    {result.message}
                  </p>
                  
                  {result.details && (
                    <details className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <summary className={`cursor-pointer ${
                        theme === 'dark' ? 'hover:text-gray-300' : 'hover:text-gray-800'
                      }`}>
                        查看详细信息
                      </summary>
                      <pre className={`mt-2 p-2 rounded overflow-auto ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-200' 
                          : 'bg-gray-100'
                      }`}>
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className={`mt-8 p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-blue-900 bg-opacity-30' 
              : 'bg-blue-50'
          }`}>
            <h3 className={`font-medium mb-2 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
            }`}>使用说明</h3>
            <ul className={`text-sm space-y-1 ${
              theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
            }`}>
              <li>• 环境变量检查：验证API密钥和配置是否正确</li>
              <li>• API连接测试：测试与OpenAI API的连接状态</li>
              <li>• 周报生成测试：验证核心功能是否正常工作</li>
            </ul>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}