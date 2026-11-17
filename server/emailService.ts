import nodemailer from 'nodemailer'

export interface EmailDispatchResult {
  sent: boolean
  reason?: 'smtp_not_configured' | 'smtp_error'
  messageId?: string
  error?: string
}

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
const SMTP_FROM = process.env.SMTP_FROM || (SMTP_USER ? `"Portfolio Contact" <${SMTP_USER}>` : '"Portfolio Contact" <no-reply@aman-portfolio.local>')
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || '1823ary@gmail.com'

export function isSmtpConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)
}

/**
 * Dispatches an email notification to Aman if SMTP is configured.
 * Never throws an unhandled error so form submissions remain resilient.
 */
export async function sendContactNotification(
  name: string,
  email: string,
  subject: string,
  message: string,
  inquiryId: number
): Promise<EmailDispatchResult> {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: 'smtp_not_configured',
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
    })

    const textContent = `
New portfolio message received!

Inquiry ID: #${inquiryId}
From: ${name} (${email})
Subject: ${subject}
Received at: ${new Date().toISOString()}

Message:
--------------------------------------------------
${message}
--------------------------------------------------
`.trim()

    const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #0f172a; margin-top: 0;">New Portfolio Contact Inquiry (#${inquiryId})</h2>
  <p><strong>From:</strong> ${escapeHtml(name)} &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;</p>
  <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
  <p><strong>Date:</strong> ${new Date().toUTCString()}</p>
  <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
  <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">
${escapeHtml(message)}
  </div>
</div>
`.trim()

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
      text: textContent,
      html: htmlContent,
    })

    return {
      sent: true,
      messageId: info.messageId,
    }
  } catch (err: any) {
    console.error('SMTP email dispatch error:', err.message)
    return {
      sent: false,
      reason: 'smtp_error',
      error: err.message,
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
