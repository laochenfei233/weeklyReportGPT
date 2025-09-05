export class CaptchaService {
  private static captchaStore = new Map<string, { code: string, expires: number }>()
  private static ipRestrictionStore = new Map<string, { attempts: number, lastAttempt: number }>()
  private static EXPIRATION_TIME = 5 * 60 * 1000 // 5分钟
  private static MAX_ATTEMPTS = 5
  private static IP_BLOCK_TIME = 30 * 60 * 1000 // 30分钟

  static generateCaptcha(): { text: string, id: string } {
    // 生成随机验证码
    const text = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    // 存储验证码
    const captchaId = Math.random().toString(36).substring(2)
    this.captchaStore.set(captchaId, {
      code: text,
      expires: Date.now() + this.EXPIRATION_TIME
    })
    
    // 清理过期验证码
    this.cleanupExpired()
    
    return {
      text,
      id: captchaId
    }
  }

  static verifyCaptcha(id: string, code: string, ip?: string): boolean {
    // 检查IP限制
    if (ip && this.isIPRestricted(ip)) {
      return false
    }

    const captcha = this.captchaStore.get(id)
    if (!captcha || Date.now() > captcha.expires) {
      if (ip) this.recordFailedAttempt(ip)
      return false
    }

    const isValid = captcha.code === code.toUpperCase()
    if (!isValid && ip) {
      this.recordFailedAttempt(ip)
    } else if (ip) {
      this.clearIPAttempts(ip)
    }

    this.captchaStore.delete(id)
    return isValid
  }

  private static isIPRestricted(ip: string): boolean {
    const record = this.ipRestrictionStore.get(ip)
    if (!record) return false

    // 检查是否在封锁期内
    if (Date.now() - record.lastAttempt < this.IP_BLOCK_TIME) {
      return record.attempts >= this.MAX_ATTEMPTS
    }
    return false
  }

  private static recordFailedAttempt(ip: string): void {
    const current = this.ipRestrictionStore.get(ip) || { attempts: 0, lastAttempt: 0 }
    const now = Date.now()
    
    // 如果上次尝试超过30分钟，重置计数
    const attempts = now - current.lastAttempt > this.IP_BLOCK_TIME 
      ? 1 
      : current.attempts + 1

    this.ipRestrictionStore.set(ip, {
      attempts,
      lastAttempt: now
    })
  }

  private static clearIPAttempts(ip: string): void {
    this.ipRestrictionStore.delete(ip)
  }

  private static cleanupExpired(): void {
    const now = Date.now()
    for (const [id, captcha] of this.captchaStore.entries()) {
      if (now > captcha.expires) {
        this.captchaStore.delete(id)
      }
    }
  }
}