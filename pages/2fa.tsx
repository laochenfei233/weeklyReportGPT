import { useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Enable2FA } from '../components/admin/Enable2FA'
import { Verify2FA } from '../components/admin/Verify2FA'
import { useTheme } from '../contexts/ThemeContext'
import styles from '../styles/admin-2fa.module.css'

export default function TwoFAPage() {
  const { theme } = useTheme()
  const [adminId] = useState('admin@example.com')
  const [mode, setMode] = useState<'setup' | 'verify'>('setup')

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Head>
        <title>双重验证设置 - Weekly Report GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-md mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-xl ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } border shadow-md`}
        >
          <h1 className={`text-2xl font-bold mb-8 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            双重验证设置
          </h1>
          
          {mode === 'setup' ? (
            <>
              <Enable2FA adminId={adminId} />
              <button 
                className={`${styles.button} ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => setMode('verify')}
              >
                我已设置2FA，现在测试验证
              </button>
            </>
          ) : (
            <Verify2FA 
              adminId={adminId}
              onSuccess={(is2FAVerified) => {
                alert(is2FAVerified ? '2FA验证成功' : '验证码验证成功')
                setMode('setup')
              }}
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}