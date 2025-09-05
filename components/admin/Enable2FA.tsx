import { useState, useEffect } from 'react'
import { TOTPService } from '../../utils/auth/totp.service'
import { QRCodeSVG } from 'qrcode.react'
import { CaptchaService } from '../../utils/auth/captcha.service'
import styles from '../../styles/admin-2fa.module.css'

export const Enable2FA = ({ adminId }: { adminId: string }) => {
  const [step, setStep] = useState<'captcha' | 'scan' | 'verify' | 'done'>('captcha')
  const [captcha, setCaptcha] = useState<{ text: string; id: string } | null>(null)
  const [captchaInput, setCaptchaInput] = useState('')
  const [secret, setSecret] = useState('')
  const [otpAuthUrl, setOtpAuthUrl] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  // 初始化验证码
  useEffect(() => {
    if (step === 'captcha') {
      const { text, id } = CaptchaService.generateCaptcha()
      setCaptcha({ text, id })
    }
  }, [step])

  const handleCaptchaSubmit = () => {
    if (!captcha?.id) return
    
    if (CaptchaService.verifyCaptcha(captcha.id, captchaInput)) {
      // 验证通过，生成2FA密钥
      const newSecret = TOTPService.generateSecret()
      setSecret(newSecret)
      setOtpAuthUrl(TOTPService.generateOTPAuthUrl(adminId, newSecret))
      setStep('scan')
    } else {
      setError('验证码错误')
      setStep('captcha') // 重新生成验证码
    }
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
    <div className={styles.setupSection}>
      {step === 'captcha' && captcha && (
        <div>
          <h3>验证身份</h3>
          <p>验证码: {captcha.text}</p>
          <input
            type="text"
            className={styles.inputField}
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="输入上方验证码"
          />
          <button className={styles.button} onClick={handleCaptchaSubmit}>提交</button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {step === 'scan' && (
        <div>
          <h3>设置2FA验证</h3>
          <p>请使用认证APP扫描二维码:</p>
          <QRCodeSVG value={otpAuthUrl} className={styles.qrCode} />
          <p>或手动输入密钥: {secret}</p>
          <button className={styles.button} onClick={() => setStep('verify')}>下一步</button>
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
          <button className={styles.button} onClick={handleVerifyToken}>验证</button>
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