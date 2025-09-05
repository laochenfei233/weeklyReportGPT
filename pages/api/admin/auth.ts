import { NextApiRequest, NextApiResponse } from 'next'
import { TOTPService } from '../../../utils/auth/totp.service'
import { CaptchaService } from '../../../utils/auth/captcha.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action } = req.query

  switch (action) {
    case 'generate-captcha':
      const captcha = CaptchaService.generateCaptcha()
      res.status(200).json({ image: captcha.image, id: captcha.id })
      break

    case 'verify-captcha':
      const { id, code } = req.body
      const isValid = CaptchaService.verifyCaptcha(id, code)
      res.status(200).json({ valid: isValid })
      break

    case 'enable-2fa':
      const { adminId } = req.body
      const secret = TOTPService.generateSecret()
      const otpAuthUrl = TOTPService.generateOTPAuthUrl(adminId, secret)
      res.status(200).json({ secret, otpAuthUrl })
      break

    case 'verify-2fa':
      const { adminId: verifyAdminId, token } = req.body
      const storedSecret = TOTPService.getSecret(verifyAdminId)
      if (!storedSecret) {
        res.status(400).json({ error: '2FA not enabled' })
        return
      }
      const valid = TOTPService.verifyToken(token, storedSecret)
      res.status(200).json({ valid })
      break

    case 'disable-2fa':
      const { adminId: disableAdminId, captchaId, captchaCode } = req.body
      if (!CaptchaService.verifyCaptcha(captchaId, captchaCode)) {
        res.status(400).json({ error: 'Invalid captcha' })
        return
      }
      TOTPService.removeSecret(disableAdminId)
      res.status(200).json({ success: true })
      break

    default:
      res.status(404).json({ error: 'Action not found' })
  }
}