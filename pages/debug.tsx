import { useState } from 'react'
import Head from 'next/head'
import { toast, Toaster } from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface TestResult {
  test: string
  status: 'success' | 'error' | 'loading'
  message: string
  details?: any
}

export default function Debug() {
  const { theme } = useTheme()
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateResult = (test: string, status: TestResult['status'], message: string, details?: any) => {
    setResults(prev => {
      const existing = prev.find(r => r.test === test)
      if (existing) {
        return prev.map(r => r.test === test ? { ...r, status, message, details } : r)
      }
      return [...prev, { test, status, message, details }]
    })
  }

  const runTests = async () => {
    setIsRunning(true)
    setResults([])

    // 测试1: 环境变量检查
    updateResult('环境变量', 'loading', '检查中...')
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-env' })
      })
      const data = await response.json()
      
      if (response.ok) {
        updateResult('环境变量', 'success', '环境变量配置正常', data)
      } else {
        updateResult('环境变量', 'error', data.error || '环境变量检查失败', data)
      }
    } catch (error) {
      updateResult('环境变量', 'error', '网络请求失败', error)
    }

    // 测试2: API连接测试
    updateResult('API连接', 'loading', '测试中...')
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-api' })
      })
      const data = await response.json()
      
      if (response.ok) {
        updateResult('API连接', 'success', 'API连接正常', data)
      } else {
        updateResult('API连接', 'error', data.error || 'API连接失败', data)
      }
    } catch (error) {
      updateResult('API连接', 'error', '网络请求失败', error)
    }

    // 测试3: 周报生成测试
    updateResult('周报生成', 'loading', '测试中...')
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '完成了项目调试功能的开发和测试工作' })
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let result = ''
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            result += decoder.decode(value)
          }
        }
        
        updateResult('周报生成', 'success', '周报生成功能正常', { preview: result.substring(0, 100) + '...' })
      } else {
        const errorData = await response.json()
        updateResult('周报生成', 'error', errorData.error || '周报生成失败', errorData)
      }
    } catch (error) {
      updateResult('周报生成', 'error', '网络请求失败', error)
    }

    setIsRunning(false)
    toast.success('调试测试完成')
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-gray-700'
      case 'error': return 'text-gray-700'
      case 'loading': return 'text-gray-500'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Head>
        <title>系统调试 - Weekly Report GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto py-8 px-4 sm:px-6">
        <div className={`rounded-xl p-8 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            系统调试面板
          </h1>
          
          <motion.button
            onClick={runTests}
            disabled={isRunning}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg ${
              isRunning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-800 hover:bg-gray-700'
            } text-white shadow-md transition-all`}
          >
            {isRunning ? '测试中...' : '开始系统测试'}
          </motion.button>

          {results.length > 0 && (
            <div className="mt-10 space-y-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                测试结果
              </h2>
              
              <AnimatePresence>
                {results.map((result) => (
                  <motion.div
                    key={result.test}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-6 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {result.test}
                      </h3>
                      <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                        {result.status === 'loading' ? '测试中' : 
                         result.status === 'success' ? '通过' : '失败'}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${getStatusColor(result.status)} mb-3`}>
                      {result.message}
                    </p>
                    
                    {result.details && (
                      <details className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <summary className={`cursor-pointer ${theme === 'dark' ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>
                          查看详细信息
                        </summary>
                        <pre className={`mt-2 p-3 rounded overflow-auto ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100'
                        }`}>
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className={`mt-12 p-6 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-medium mb-4 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              <span className={`inline-block w-6 h-6 mr-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              } text-center`}>ℹ️</span>
              使用说明
            </h3>
            <ul className={`text-sm space-y-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li className="flex items-start">
                <span className={`inline-block mt-1 mr-2 w-4 h-4 rounded-full ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
                环境变量检查：验证API密钥和配置是否正确
              </li>
              <li className="flex items-start">
                <span className={`inline-block mt-1 mr-2 w-4 h-4 rounded-full ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
                API连接测试：测试与OpenAI API的连接状态
              </li>
              <li className="flex items-start">
                <span className={`inline-block mt-1 mr-2 w-4 h-4 rounded-full ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
                周报生成测试：验证核心功能是否正常工作
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
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
    </div>
  )
}