import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthState } from '../hooks/useAuth';

export default function Profile() {
  const router = useRouter();
  const { user, stats, isLoading } = useAuthState();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  const usagePercentage = (stats.todayUsage / stats.dailyLimit) * 100;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>个人中心 - Weekly Report GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">个人中心</h1>
          
          {/* 用户信息卡片 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">{user.email}</h2>
                <p className="text-gray-600">
                  {user.isAdmin ? '管理员账户' : '普通用户'}
                </p>
                <p className="text-sm text-gray-500">
                  注册时间: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Token 使用统计 */}
          {!user.isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 今日使用量 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">今日使用量</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">已使用</span>
                    <span className="font-semibold text-blue-600">
                      {stats.todayUsage.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">每日限额</span>
                    <span className="font-semibold text-gray-900">
                      {stats.dailyLimit.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        usagePercentage > 90 ? 'bg-red-500' :
                        usagePercentage > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className={`text-sm font-medium ${
                      usagePercentage > 90 ? 'text-red-600' :
                      usagePercentage > 70 ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      剩余 {Math.max(0, stats.dailyLimit - stats.todayUsage).toLocaleString()} tokens
                      ({(100 - usagePercentage).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* 总使用量 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">累计统计</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">总使用量</span>
                    <span className="font-semibold text-green-600">
                      {stats.totalUsage.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">平均每日</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(stats.totalUsage / Math.max(1, stats.weeklyUsage.length)).toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      感谢您的使用！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 最近7天使用趋势 */}
          {!user.isAdmin && stats.weeklyUsage.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最近7天使用趋势</h3>
              <div className="space-y-3">
                {stats.weeklyUsage.map((day, index) => {
                  const percentage = (day.daily_total / stats.dailyLimit) * 100;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString('zh-CN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-24 text-sm text-gray-900 text-right">
                        {day.daily_total.toLocaleString()} tokens
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 管理员特权说明 */}
          {user.isAdmin && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">管理员特权</h3>
                  <p className="text-blue-700">您拥有管理员权限，无Token使用限制</p>
                </div>
              </div>
            </div>
          )}

          {/* 使用建议 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">使用建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">💡 节省Token技巧</h4>
                <ul className="space-y-1">
                  <li>• 简洁描述工作内容</li>
                  <li>• 避免重复信息</li>
                  <li>• 使用关键词而非长句</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🔧 获得更多使用量</h4>
                <ul className="space-y-1">
                  <li>• 配置自己的API密钥</li>
                  <li>• 支持多种AI服务商</li>
                  <li>• 在设置页面进行配置</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}