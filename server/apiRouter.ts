import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import {
  saveContactMessage,
  getContactMessages,
  logTerminalQuery,
  getCachedItem,
  setCachedItem,
  createDatabaseBackup,
} from './db'
import {
  requireAdminAuth,
  verifyAdminCredentials,
  signAdminToken,
  checkLoginBruteForce,
  recordFailedLogin,
  clearFailedLogin,
} from './auth'
import { sendContactNotification, isSmtpConfigured } from './emailService'
import { projects } from '../src/data'
import { githubProfile, featuredNames } from '../src/github-profile'
import githubSnapshot from '../src/services/github-snapshot.json'
import contributionsSnapshot from '../src/services/github-contributions-snapshot.json'
import { GALAXY_NODES_3D, GALAXY_LINKS_3D } from '../src/Universe/galaxyData'
import { processTerminalInput } from '../src/ApyTerminal/terminalKnowledge'

export const apiRouter = express.Router()

// ---------------------------------------------------------------------------
// Security Headers Middleware
// ---------------------------------------------------------------------------
apiRouter.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})

// ---------------------------------------------------------------------------
// Configured CORS Restrictions
// ---------------------------------------------------------------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5173']

apiRouter.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin.endsWith('.vercel.app')) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    credentials: true,
  })
)

// Strictly limit request payload size to 50kb to prevent payload flooding
apiRouter.use(express.json({ limit: '50kb' }))

// Rate limiting in-memory store
interface RateLimitBucket {
  count: number
  resetTime: number
}
const rateLimits = new Map<string, RateLimitBucket>()

function checkRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const bucket = rateLimits.get(key)
  if (!bucket || now > bucket.resetTime) {
    rateLimits.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }
  if (bucket.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }
  bucket.count++
  return { allowed: true, remaining: maxRequests - bucket.count }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return req.socket.remoteAddress || '127.0.0.1'
}

function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/[<>]/g, '') // Strip raw HTML brackets
    .replace(/javascript:/gi, '') // Strip inline JS protocols
    .replace(/\0/g, '')   // Strip null bytes
    .trim()
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ---------------------------------------------------------------------------
// 1. Health Check
// ---------------------------------------------------------------------------
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    database: 'sqlite-connected',
    emailConfigured: isSmtpConfigured(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// ---------------------------------------------------------------------------
// 2. All Projects with GitHub Metadata
// ---------------------------------------------------------------------------
apiRouter.get('/projects', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cached = getCachedItem<any>('all_projects_v1', 15 * 60 * 1000)
    if (cached) {
      return res.json(cached)
    }

    const repoMap = new Map<string, any>()
    for (const r of githubSnapshot) {
      repoMap.set(r.name.toLowerCase(), r)
    }

    const featuredGitHubProjects = featuredNames.map(name => {
      const match = repoMap.get(name.toLowerCase())
      return {
        slug: `github-${name}`,
        title: name,
        category: 'GitHub Repository',
        description: match?.description || 'Autonomous systems, machine learning, and computational workflows.',
        language: match?.language || 'Python',
        stars: match?.stargazers_count ?? 0,
        forks: match?.forks_count ?? 0,
        updatedAt: match?.updated_at || new Date().toISOString(),
        githubUrl: match?.html_url || `https://github.com/${githubProfile.username}/${name}`,
        topics: match?.topics || [],
        isGitHubFeatured: true,
      }
    })

    const payload = {
      success: true,
      totalCount: projects.length + featuredGitHubProjects.length,
      customProjects: projects,
      featuredGitHubProjects,
      categories: [
        'AI / Machine Learning',
        'Data Science & Analytics',
        'EdTech & Systems',
        'Web Applications',
      ],
    }

    setCachedItem('all_projects_v1', payload)
    res.json(payload)
  } catch (err) {
    next(err)
  }
})

// ---------------------------------------------------------------------------
// 3. Real-time GitHub Activity & Statistics
// ---------------------------------------------------------------------------
apiRouter.get('/github/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cached = getCachedItem<any>('github_live_stats_v1', 10 * 60 * 1000)
    if (cached) {
      return res.json({ ...cached, fromCache: true })
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'AmanKumar-Portfolio-Backend',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    let profileData: any = {
      public_repos: githubSnapshot.length,
      followers: 1,
      following: 0,
    }
    let contributionsData: any = contributionsSnapshot

    try {
      const userRes = await fetch(`https://api.github.com/users/${githubProfile.username}`, {
        headers,
        signal: AbortSignal.timeout(6000),
      })
      if (userRes.ok) {
        const u = await userRes.json()
        profileData = {
          public_repos: u.public_repos,
          followers: u.followers,
          following: u.following,
        }
      }

      const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubProfile.username}`, {
        signal: AbortSignal.timeout(6000),
      })
      if (contribRes.ok) {
        contributionsData = await contribRes.json()
      }
    } catch (networkErr) {
      console.warn('Backend GitHub live fetch notice (using verified snapshots):', networkErr)
    }

    const totalStars = githubSnapshot.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
    const totalForks = githubSnapshot.reduce((acc, r) => acc + (r.forks_count || 0), 0)

    const payload = {
      success: true,
      username: githubProfile.username,
      profile: profileData,
      contributions: contributionsData,
      metrics: {
        totalRepositories: profileData.public_repos || githubSnapshot.length,
        totalStars,
        totalForks,
        featuredCount: featuredNames.length,
      },
      updatedAt: new Date().toISOString(),
    }

    setCachedItem('github_live_stats_v1', payload)
    res.json(payload)
  } catch (err) {
    next(err)
  }
})

// ---------------------------------------------------------------------------
// 4. Contact Form Submission with Optional Email & Database Persistence
// ---------------------------------------------------------------------------
apiRouter.post('/contact', async (req: Request, res: Response) => {
  const ip = getClientIp(req)

  // Rate limit: max 5 submissions per 10 minutes per IP
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Too many messages sent from this IP. Please wait a few minutes before trying again.',
    })
  }

  const name = sanitizeText(req.body.name)
  const email = sanitizeText(req.body.email)
  const subject = sanitizeText(req.body.subject)
  const message = sanitizeText(req.body.message)

  // Strict Payload Validation
  if (!name || name.length < 2 || name.length > 100) {
    return res.status(400).json({ success: false, error: 'Name must be between 2 and 100 characters.' })
  }
  if (!email || !isValidEmail(email) || email.length > 150) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' })
  }
  if (!subject || subject.length < 2 || subject.length > 200) {
    return res.status(400).json({ success: false, error: 'Subject must be between 2 and 200 characters.' })
  }
  if (!message || message.length < 5 || message.length > 5000) {
    return res.status(400).json({ success: false, error: 'Message must be between 5 and 5000 characters.' })
  }

  try {
    const messageId = saveContactMessage(name, email, subject, message, ip)

    // Attempt email dispatch if SMTP is configured
    const emailResult = await sendContactNotification(name, email, subject, message, messageId)

    const responseMessage = emailResult.sent
      ? "Thank you! Your message has been saved and forwarded to Aman's email."
      : 'Thank you! Your message has been securely recorded in the database. Aman reviews stored messages regularly.'

    res.status(201).json({
      success: true,
      messageId,
      emailDispatched: emailResult.sent,
      message: responseMessage,
    })
  } catch (err: any) {
    console.error('Contact form storage error:', err)
    res.status(500).json({ success: false, error: 'Failed to process inquiry. Please try again later.' })
  }
})

// ---------------------------------------------------------------------------
// 5. Admin Authentication & Session Management
// ---------------------------------------------------------------------------
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  const ip = getClientIp(req)

  // Brute-force protection: max 5 failed attempts per 15 minutes
  const attemptCheck = checkLoginBruteForce(ip)
  if (!attemptCheck.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Account temporarily locked for ${attemptCheck.retryAfterSec} seconds.`,
    })
  }

  const username = sanitizeText(req.body.username)
  const password = typeof req.body.password === 'string' ? req.body.password : ''

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' })
  }

  const isValid = verifyAdminCredentials(username, password)
  if (!isValid) {
    recordFailedLogin(ip)
    return res.status(401).json({
      success: false,
      error: 'Invalid admin username or password.',
    })
  }

  clearFailedLogin(ip)
  const { token, expiresAt } = signAdminToken(username)

  res.json({
    success: true,
    token,
    expiresAt,
    user: username,
    message: 'Admin authentication successful.',
  })
})

apiRouter.get('/admin/verify', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    authenticated: true,
    user: (req as any).adminUser || 'admin',
    timestamp: new Date().toISOString(),
  })
})

// Protected Admin Inquiries Endpoint (SECURED)
apiRouter.get('/contact/messages', requireAdminAuth, (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100)
  try {
    const messages = getContactMessages(limit)
    res.json({
      success: true,
      count: messages.length,
      messages,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve messages.' })
  }
})

// Protected Admin Database Snapshot Backup
apiRouter.post('/admin/backup', requireAdminAuth, (_req: Request, res: Response) => {
  const result = createDatabaseBackup()
  if (result.success) {
    res.json({
      success: true,
      message: 'Database backup snapshot created successfully.',
      backupPath: result.backupPath,
    })
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Database backup failed.',
    })
  }
})

// ---------------------------------------------------------------------------
// 6. APY Terminal Intelligence Query (Honest Rule-Based Engine Telemetry)
// ---------------------------------------------------------------------------
apiRouter.post('/terminal/query', (req: Request, res: Response) => {
  const ip = getClientIp(req)

  // Rate limit: 40 queries per minute per IP
  const rateLimit = checkRateLimit(`terminal:${ip}`, 40, 60 * 1000)
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Terminal rate limit exceeded. Please slow down your requests.',
    })
  }

  const query = sanitizeText(req.body.query)
  if (!query) {
    return res.status(400).json({ success: false, error: 'Query parameter is required.' })
  }

  try {
    const response = processTerminalInput(query)
    logTerminalQuery(query, 'general', ip)

    res.json({
      success: true,
      query,
      response,
      engine: 'rule-based-nlp',
      isAIModel: false,
      engineDescription: 'Local rule-based knowledge engine & natural language matcher grounded in verified portfolio data.',
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('Terminal query error:', err)
    res.status(500).json({ success: false, error: 'Internal error processing terminal query.' })
  }
})

// ---------------------------------------------------------------------------
// 7. Dynamic Knowledge Universe Graph
// ---------------------------------------------------------------------------
apiRouter.get('/universe/graph', (req: Request, res: Response) => {
  const cluster = typeof req.query.cluster === 'string' ? req.query.cluster.toLowerCase() : undefined
  const tier = req.query.tier ? Number(req.query.tier) : undefined
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : undefined

  let filteredNodes = GALAXY_NODES_3D

  if (cluster) {
    filteredNodes = filteredNodes.filter(n => n.category.toLowerCase() === cluster)
  }

  if (tier && [1, 2, 3].includes(tier)) {
    filteredNodes = filteredNodes.filter(n => n.tier === tier)
  }

  if (search) {
    filteredNodes = filteredNodes.filter(n =>
      n.name.toLowerCase().includes(search) ||
      n.tagline.toLowerCase().includes(search) ||
      n.description.toLowerCase().includes(search) ||
      n.relatedSkills.some(s => s.toLowerCase().includes(search))
    )
  }

  const visibleNodeIds = new Set(filteredNodes.map(n => n.id))
  const filteredLinks = GALAXY_LINKS_3D.filter(
    l => visibleNodeIds.has(l.source) && visibleNodeIds.has(l.target)
  )

  res.json({
    success: true,
    nodes: filteredNodes,
    links: filteredLinks,
    stats: {
      totalVisibleNodes: filteredNodes.length,
      totalVisibleLinks: filteredLinks.length,
      allNodesCount: GALAXY_NODES_3D.length,
      allLinksCount: GALAXY_LINKS_3D.length,
    },
  })
})

// ---------------------------------------------------------------------------
// Global Sanitized Error Handler (Never Leaks Internal Stack Traces)
// ---------------------------------------------------------------------------
apiRouter.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('API Error:', err?.message || err)
  const isProd = process.env.NODE_ENV === 'production'
  res.status(500).json({
    success: false,
    error: isProd ? 'An unexpected server error occurred.' : (err?.message || 'Server error'),
  })
})
