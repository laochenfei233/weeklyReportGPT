import { authenticator } from 'otplib'
import CryptoJS from 'crypto-js'

// 加密密钥(实际项目中应从安全配置读取)
const ENCRYPTION_KEY = 'your-secure-encryption-key'

export class TOTPService {
  private static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
  }

  private static decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  static generateSecret(): string {
    return authenticator.generateSecret()
  }

  static generateOTPAuthUrl(accountName: string, secret: string): string {
    return authenticator.keyuri(accountName, 'YourAppName', secret)
  }

  static verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret })
  }

  static saveSecret(adminId: string, secret: string): void {
    const encrypted = this.encrypt(secret)
    localStorage.setItem(`2fa_${adminId}`, encrypted)
  }

  static getSecret(adminId: string): string | null {
    const encrypted = localStorage.getItem(`2fa_${adminId}`)
    return encrypted ? this.decrypt(encrypted) : null
  }

  static removeSecret(adminId: string): void {
    localStorage.removeItem(`2fa_${adminId}`)
  }
}