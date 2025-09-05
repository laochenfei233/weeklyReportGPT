import { useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Enable2FA } from '../components/admin/Enable2FA'
import { Verify2FA } from '../components/admin/Verify2FA'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuthState } from '../hooks/useAuth'

export default function TwoFAPage() {
  const { user } = useAuthState()
  const [adminId] = useState(user?.email || 'admin@example.com')
  const [mode, setMode] = useState<'setup' | 'verify'>('setup')
  const [ipAddress] = useState('192.168.1.1') // 实际使用中应从请求获取

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>双重验证设置</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full"
        >
          <h1 className="sm:text-4xl text-3xl font-bold text-slate-900 mb-6">
            双重验证设置
          </h1>
          
          {mode === 'setup' ? (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Enable2FA adminId={adminId} />
              <button 
                className="mt-6 w-full bg-black text-white font-medium py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => setMode('verify')}
              >
                我已设置2FA，现在测试验证
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Verify2FA 
                adminId={adminId}
                ipAddress={ipAddress}
                onSuccess={(is2FAVerified) => {
                  alert(is2FAVerified ? '2FA验证成功' : '验证码验证成功')
                  setMode('setup')
                }}
              />
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}