import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TOTPService } from '../../utils/auth/totp.service'
import { QRCodeSVG } from 'qrcode.react'
import { CaptchaService } from '../../utils/auth/captcha.service'
import LoadingDots from '../LoadingDots'
import { useTheme } from '../../contexts/ThemeContext'
import styles from '../../styles/admin-2fa.module.css'

export const Enable2FA = ({ adminId }: { adminId: string }) => {
  const [step, setStep] = useState<'captcha' | 'scan' | 'verify' | 'done'>('captcha')
  const [captcha, setCaptcha] = useState<{ text: string; id: string } | null>(null)
  const [captchaInput, setCaptchaInput] = useState('')
  const [secret, setSecret] = useState('')
  const [otpAuthUrl, setOtpAuthUrl] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()

  // 初始化验证码
  useEffect(() => {
    if (step === 'captcha') {
      const { text, id } = CaptchaService.generateCaptcha()
      setCaptcha({ text, id })
    }
  }, [step])

  const handleCaptchaSubmit = async () => {
    if (!captcha?.id) return
    
    setIsSubmitting(true)
    setError('')
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (CaptchaService.verifyCaptcha(captcha.id, captchaInput)) {
      const newSecret = TOTPService.generateSecret()
      setSecret(newSecret)
      setOtpAuthUrl(TOTPService.generateOTPAuthUrl(adminId, newSecret))
      setStep('scan')
    } else {
      setError('验证码错误')
      setStep('captcha')
    }
    
    setIsSubmitting(false)
  }

  const handleVerifyToken = () => {
    if (TOTPService.verifyToken(token, secret)) {
      // 验证通过，保存密钥
      TOTPService.saveSecret(adminId, secret)
      setStep('done')
    } else {
      setError('验证码无效')
    }
  }

  return (
    <div className="space-y-6">
      {step === 'captcha' && captcha && (
        <div>
          <h3 className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
            验证身份
          </h3>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            验证码: <span className="font-mono">{captcha.text}</span>
          </p>
          <input
            type="text"
            className={`w-full rounded-md p-3 border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white focus:ring-primary-500 focus:border-primary-500'
                : 'border-gray-300 focus:ring-black focus:border-black'
            }`}
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="输入上方验证码"
            autoFocus
          />
          <motion.button
            className="w-full bg-black text-white font-medium py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            onClick={handleCaptchaSubmit}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingDots color="white" /> : '提交'}
          </motion.button>
          {error && <p className={`text-sm mt-2 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}>{error}</p>}
        </div>
      )}

      {step === 'scan' && (
        <div>
          <h3>设置2FA验证</h3>
          <p>请使用认证APP扫描二维码:</p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <QRCodeSVG 
              value={otpAuthUrl} 
              size={200}
              className={`border rounded-lg p-4 ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}
              fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
              bgColor={theme === 'dark' ? '#1f2937' : '#ffffff'}
            />
          </motion.div>
          <p>或手动输入密钥: {secret}</p>
          <motion.button
            className="w-full bg-black text-white font-medium py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            onClick={() => setStep('verify')}
            whileTap={{ scale: 0.98 }}
          >
            下一步
          </motion.button>
        </div>
      )}

      {step === 'verify' && (
        <div>
          <h3>验证2FA代码</h3>
          <p>请输入认证APP中的6位代码:</p>
          <input
            type="text"
            className={styles.inputField}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="6位验证码"
          />
          <motion.button
            className="w-full bg-black text-white font-medium py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            onClick={handleVerifyToken}
            whileTap={{ scale: 0.98 }}
          >
            验证
          </motion.button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {step === 'done' && (
        <div>
          <h3>2FA已启用</h3>
          <p>您的账户已成功启用双重验证</p>
        </div>
      )}
    </div>
  )
}