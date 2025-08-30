import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function GenerateJWT() {
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSecret = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-jwt-secret');
      const data = await response.json();
      
      if (data.success) {
        setSecret(data.jwt_secret);
      } else {
        alert('生成失败：' + data.error);
      }
    } catch (error) {
      alert('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = secret;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>JWT Secret 生成器</title>
      </Head>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🔐 JWT Secret 生成器</h1>
          <p className="text-gray-600 mb-6">为你的应用生成安全的JWT密钥</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={generateSecret}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '生成中...' : '🎲 生成新密钥'}
          </button>

          {secret && (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  生成的 JWT_SECRET:
                </label>
                <div className="bg-white p-2 rounded border font-mono text-xs break-all">
                  {secret}
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                {copied ? '✅ 已复制!' : '📋 复制密钥'}
              </button>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-900 mb-2">📋 配置步骤:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. 复制上面的密钥</li>
                  <li>2. 进入 Vercel Dashboard</li>
                  <li>3. Settings → Environment Variables</li>
                  <li>4. 添加变量: JWT_SECRET</li>
                  <li>5. 粘贴密钥值</li>
                  <li>6. 重新部署项目</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md">
                <h3 className="font-medium text-yellow-900 mb-2">⚠️ 安全提醒:</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• 请妥善保管此密钥</li>
                  <li>• 不要分享给他人</li>
                  <li>• 不要提交到代码仓库</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}