import { createHmac, randomBytes, timingSafeEqual, scryptSync } from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'

// Admin credentials from environment with secure fallbacks for development
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'aman'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'amanportfolio2026!'
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || ''

// Session token signing secret (randomized per server run if not set)
const TOKEN_SECRET = process.env.ADMIN_SECRET || randomBytes(32).toString('hex')

if (!process.env.ADMIN_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ [SECURITY NOTICE] ADMIN_SECRET environment variable is not set. Generated ephemeral secret for this session.')
}

// Token lifetime: 4 hours
const TOKEN_EXPIRY_MS = 4 * 60 * 60 * 1000

// In-memory failed login tracking for brute-force prevention
interface LoginAttemptRecord {
  failures: number
  lockoutUntil: number
}
const loginAttempts = new Map<string, LoginAttemptRecord>()

export function checkLoginBruteForce(ip: string): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  
  if (!record) {
    return { allowed: true, remainingAttempts: 5 }
  }

  if (record.lockoutUntil > now) {
    const retryAfterSec = Math.ceil((record.lockoutUntil - now) / 1000)
    return { allowed: false, remainingAttempts: 0, retryAfterSec }
  }

  // Reset if lockout expired
  if (record.lockoutUntil <= now && record.failures >= 5) {
    loginAttempts.delete(ip)
    return { allowed: true, remainingAttempts: 5 }
  }

  return { allowed: true, remainingAttempts: Math.max(0, 5 - record.failures) }
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now()
  const record = loginAttempts.get(ip) || { failures: 0, lockoutUntil: 0 }
  record.failures++
  if (record.failures >= 5) {
    record.lockoutUntil = now + 15 * 60 * 1000 // 15-minute lockout
  }
  loginAttempts.set(ip, record)
}

export function clearFailedLogin(ip: string): void {
  loginAttempts.delete(ip)
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function safeStringCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8')
    const bufB = Buffer.from(b, 'utf8')
    if (bufA.length !== bufB.length) {
      // Hash both to equalize length before timingSafeEqual to avoid length leakage
      const hashA = scryptSync(bufA, 'fixed-salt', 32)
      const hashB = scryptSync(bufB, 'fixed-salt', 32)
      timingSafeEqual(hashA, hashB)
      return false
    }
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

/**
 * Validates admin username and password
 */
export function verifyAdminCredentials(user: unknown, pass: unknown): boolean {
  if (typeof user !== 'string' || typeof pass !== 'string') return false
  const userValid = safeStringCompare(user.trim(), ADMIN_USERNAME)
  const passValid = safeStringCompare(pass, ADMIN_PASSWORD)
  return userValid && passValid
}

export interface AdminTokenPayload {
  sub: string
  iat: number
  exp: number
  jti: string
}

/**
 * Issues a cryptographically signed HMAC-SHA256 session token
 */
export function signAdminToken(username: string): { token: string; expiresAt: string } {
  const now = Date.now()
  const exp = now + TOKEN_EXPIRY_MS
  const payload: AdminTokenPayload = {
    sub: username,
    iat: now,
    exp,
    jti: randomBytes(16).toString('hex'),
  }

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url')
  const token = `${payloadB64}.${signature}`

  return { token, expiresAt: new Date(exp).toISOString() }
}

/**
 * Verifies and decodes an HMAC-SHA256 admin session token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [payloadB64, signature] = parts

    const expectedSignature = createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('base64url')
    if (!safeStringCompare(signature, expectedSignature)) return null

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8')
    const payload = JSON.parse(payloadJson) as AdminTokenPayload

    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

/**
 * Express middleware requiring valid Admin authentication
 * Accepts either:
 *  - Header: Authorization: Bearer <token>
 *  - Header: X-Admin-Key: <ADMIN_API_KEY>
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  // Check static Admin API key first (if configured in environment)
  const apiKeyHeader = req.headers['x-admin-key']
  if (ADMIN_API_KEY && typeof apiKeyHeader === 'string' && safeStringCompare(apiKeyHeader, ADMIN_API_KEY)) {
    return next()
  }

  // Check Bearer token
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    const verified = verifyAdminToken(token)
    if (verified) {
      // Attach admin user to request
      ;(req as any).adminUser = verified.sub
      return next()
    }
  }

  res.status(401).json({
    success: false,
    error: 'Unauthorized: Valid admin authentication token or API key is required.',
  })
}
