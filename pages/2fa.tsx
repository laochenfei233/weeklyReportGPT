import { useState } from 'react'
import { Enable2FA } from '../components/admin/Enable2FA'
import { Verify2FA } from '../components/admin/Verify2FA'
import styles from '../styles/admin-2fa.module.css'

export default function TwoFAPage() {
  const [adminId] = useState('admin@example.com') // 实际使用中应从登录状态获取
  const [mode, setMode] = useState<'setup' | 'verify'>('setup')
  const [ipAddress] = useState('192.168.1.1') // 实际使用中应从请求获取

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>双重验证设置</h1>
      
      {mode === 'setup' ? (
        <div className={styles.setupSection}>
          <Enable2FA adminId={adminId} />
          <button 
            className={styles.button} 
            onClick={() => setMode('verify')}
            style={{ marginTop: '20px' }}
          >
            我已设置2FA，现在测试验证
          </button>
        </div>
      ) : (
        <div className={styles.verifySection}>
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
    </div>
  )
}