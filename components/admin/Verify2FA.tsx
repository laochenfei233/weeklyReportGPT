import { useState } from 'react'
import { TOTPService } from '../../utils/auth/totp.service'
import { CaptchaService } from '../../utils/auth/captcha.service'
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

  const handleVerify = () => {
    // 自动识别验证方式
    if (code.length === 6 && /^\d+$/.test(code)) {
      // 2FA验证
      const secret = TOTPService.getSecret(adminId)
      if (!secret) {
        setError('2FA未启用，请使用验证码')
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
    <div className={styles.verifySection}>
      <h3>安全验证</h3>
      <p>请输入6位2FA代码或验证码：</p>
      <input
        type="text"
        className={styles.inputField}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="2FA代码或验证码"
      />
      <button className={styles.button} onClick={handleVerify}>验证</button>
      
      {ipAddress && (
        <div className={styles.ipOption}>
          <label>
            <input 
              type="checkbox" 
              checked={isIPRestricted}
              onChange={() => setIsIPRestricted(!isIPRestricted)}
            />
            启用IP限制 ({ipAddress})
          </label>
        </div>
      )}
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}