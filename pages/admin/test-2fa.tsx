import { useState } from 'react'
import { Enable2FA } from '../../components/admin/Enable2FA'
import { Verify2FA } from '../../components/admin/Verify2FA'
import styles from '../../styles/admin-2fa.module.css'

export default function Test2FAPage() {
  const [adminId] = useState('admin@example.com')
  const [mode, setMode] = useState<'setup' | 'verify'>('setup')
  const [isVerified, setIsVerified] = useState(false)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>2FA功能测试</h1>
      
      {mode === 'setup' ? (
        <div>
          <h2>设置2FA验证</h2>
          <Enable2FA adminId={adminId} />
          <button 
            onClick={() => setMode('verify')}
            className={styles.button}
          >
            我已设置2FA，现在测试验证
          </button>
        </div>
      ) : (
        <div>
          <h2>验证2FA代码</h2>
          {!isVerified ? (
            <Verify2FA 
              adminId={adminId}
              onSuccess={() => setIsVerified(true)}
              onUseCaptcha={() => alert('请使用验证码登录')}
            />
          ) : (
            <div className={styles.success}>
              <p>2FA验证成功！</p>
              <button onClick={() => {
                setMode('setup')
                setIsVerified(false)
              }}>
                重新测试
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}