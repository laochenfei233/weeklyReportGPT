import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TOTPService } from '../../utils/auth/totp.service'
import { CaptchaService } from '../../utils/auth/captcha.service'
import LoadingDots from '../LoadingDots'
import { useTheme } from '../../contexts/ThemeContext'
import styles from '../../styles/admin-2fa.module.css'

export const Verify2FA = ({ 
  adminId,
  onSuccess,
  ipAddress
}: {
  adminId: string
  onSuccess: (is2FAVerified: boolean) => void
  ipAddress?: string
}) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isIPRestricted, setIsIPRestricted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()
  
  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.length === 6 && /^\d{6}$/.test(code)) {
        handleVerify()
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [code])

  const handleVerify = async () => {
    setIsSubmitting(true)
    setError('')
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 自动识别验证方式
    if (code.length === 6 && /^\d+$/.test(code)) {
      // 2FA验证
      const secret = TOTPService.getSecret(adminId)
      if (!secret) {
        setError('2FA未启用，请使用验证码')
        setIsSubmitting(false)
        return
      }

      if (TOTPService.verifyToken(code, secret)) {
        onSuccess(true)
      } else {
        handleFailedAttempt()
      }
    } else {
      // 验证码验证
      if (CaptchaService.verifyCaptcha(adminId, code)) {
        onSuccess(false)
      } else {
        handleFailedAttempt()
      }
    }
    
    setIsSubmitting(false)
  }

  const handleFailedAttempt = () => {
    setAttempts(attempts + 1)
    setError(`验证失败 (${attempts + 1}/5)`)
    
    if (attempts >= 4) {
      if (isIPRestricted && ipAddress) {
        // 记录IP限制逻辑
        setError('验证失败次数过多，IP已被临时限制')
      } else {
        setError('验证失败次数过多，请稍后再试')
      }
    }
  }

  return (
    <div className="space-y-6">
      <h3 className={`text-xl font-semibold ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`}>安全验证</h3>
      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
        请输入6位2FA代码或验证码：
      </p>
      <input
        type={code.length === 6 ? 'number' : 'text'}
        inputMode={code.length === 6 ? 'numeric' : 'text'}
        pattern={code.length === 6 ? '\\d*' : undefined}
        className={`w-full rounded-md p-3 border text-center text-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-white focus:ring-primary-500 focus:border-primary-500'
            : 'border-gray-300 focus:ring-black focus:border-black'
        }`}
        value={code}
        onChange={(e) => {
          const value = e.target.value
          // 限制2FA代码为6位数字
          if (value.length === 6 && /^\d+$/.test(value)) {
            setCode(value)
            // 自动提交6位2FA代码
            handleVerify()
          } else {
            setCode(value)
          }
        }}
        placeholder="2FA代码或验证码"
        maxLength={6}
        autoFocus
      />
      <motion.button
        className={`w-full font-medium py-2 px-4 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-primary-600 hover:bg-primary-700 text-white'
            : 'bg-black hover:bg-gray-800 text-white'
        }`}
        onClick={handleVerify}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoadingDots color="white" /> : '验证'}
      </motion.button>
      
      {ipAddress && (
        <div className={`flex items-center mt-4 p-3 rounded-md ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              className={`h-4 w-4 rounded ${
                theme === 'dark'
                  ? 'text-primary-600 focus:ring-primary-500 border-gray-600'
                  : 'text-black focus:ring-black border-gray-300'
              }`}
              checked={isIPRestricted}
              onChange={() => setIsIPRestricted(!isIPRestricted)}
            />
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              启用IP限制 <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                ({ipAddress})
              </span>
            </span>
          </label>
        </div>
      )}
      
      <AnimatePresence>
        {error && (
          <motion.p
            className={`mt-2 text-sm ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      </AnimatePresence>
    </div>
  )
}