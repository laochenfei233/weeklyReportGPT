import { useState } from 'react';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';

export default function QuickDebug() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testPrompt] = useState('今天完成了项目的基础功能开发');

  const testGenerate = async () => {
    setIsLoading(true);
    setResult('');

    try {
      console.log('开始测试生成API...');
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: testPrompt
        }),
        credentials: 'include'
      });

      console.log('响应状态:', response.status);
      console.log('响应头:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('错误响应:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          setResult(`❌ 错误 (${response.status}): ${errorData.error}\n\n详细信息:\n${JSON.stringify(errorData, null, 2)}`);
        } catch (e) {
          setResult(`❌ 错误 (${response.status}): ${errorText}`);
        }
        return;
      }

      // 读取流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        setResult('❌ 错误: 无法获取响应流');
        return;
      }

      const decoder = new TextDecoder();
      let fullResponse = '';
      let chunkCount = 0;

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          fullResponse += chunk;
          chunkCount++;
          
          // 实时更新结果
          setResult(`✅ 成功接收 ${chunkCount} 个数据块:\n\n${fullResponse}`);
          
          // 限制显示长度
          if (fullResponse.length > 500) {
            setResult(`✅ 成功接收 ${chunkCount} 个数据块 (已截断显示):\n\n${fullResponse.substring(0, 500)}...`);
          }
        }
        
        console.log('流式响应完成，总共接收', chunkCount, '个数据块');
        
      } catch (streamError) {
        console.error('流式读取错误:', streamError);
        setResult(`⚠️ 流式读取错误: ${streamError}\n\n已接收内容:\n${fullResponse}`);
      }

    } catch (error) {
      console.error('请求错误:', error);
      setResult(`❌ 网络错误: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnvironment = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-env' })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ 环境检查通过:\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ 环境检查失败:\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ 环境检查错误: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAPI = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-api' })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ API连接正常:\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ API连接失败:\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ API测试错误: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Head>
        <title>快速诊断 - 服务器繁忙问题</title>
      </Head>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #555'
          },
          success: {
            iconTheme: {
              primary: '#ddd',
              secondary: '#333'
            }
          },
          error: {
            iconTheme: {
              primary: '#ddd',
              secondary: '#333'
            }
          }
        }}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">快速诊断工具</h1>
        <p className="text-gray-600">
          专门用于诊断生产环境中&quot;服务器繁忙&quot;的问题
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={checkEnvironment}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          1. 检查环境变量
        </button>
        
        <button
          onClick={testAPI}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          2. 测试API连接
        </button>
        
        <button
          onClick={testGenerate}
          disabled={isLoading}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:opacity-50"
        >
          3. 测试生成功能
        </button>
      </div>

      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700">测试中...</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">测试结果</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">🔍 诊断步骤说明</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li><strong>1. 检查环境变量</strong> - 确认OPENAI_API_KEY等关键配置是否正确</li>
          <li><strong>2. 测试API连接</strong> - 验证能否连接到OpenAI API服务</li>
          <li><strong>3. 测试生成功能</strong> - 直接测试周报生成API是否正常工作</li>
        </ol>
        
        <div className="mt-3 text-xs text-yellow-600">
          <p><strong>提示</strong>: 如果第3步失败，请查看浏览器开发者工具的Console和Network标签页获取更多错误信息</p>
        </div>
      </div>
    </div>
  );
}