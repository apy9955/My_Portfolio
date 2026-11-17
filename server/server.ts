import express from 'express'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { apiRouter } from './apiRouter'
import { closeDatabase } from './db'

export const apiApp = express()
const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST || '0.0.0.0'
const distDir = join(process.cwd(), 'dist')

// Mount API router
apiApp.use('/api', apiRouter)

// In production, serve static files from dist if present
if (existsSync(distDir)) {
  appStaticMiddleware(apiApp, distDir)
}

function appStaticMiddleware(app: express.Express, dir: string) {
  app.use(express.static(dir))
  // Fallback to index.html for SPA routing
  app.use((_req, res) => {
    res.sendFile(join(dir, 'index.html'))
  })
}

export function startServer(port = PORT, host = HOST) {
  const server = apiApp.listen(port, host, () => {
    console.log(`🚀 Portfolio Backend Server running on http://${host}:${port}`)
    console.log(`📡 API Endpoints available at http://${host}:${port}/api/health`)
  })

  // Graceful shutdown handling
  const shutdown = (signal: string) => {
    console.log(`\n🛑 Received ${signal}, initiating graceful shutdown...`)
    server.close(() => {
      console.log('✓ HTTP server closed.')
      closeDatabase()
      process.exit(0)
    })
    setTimeout(() => {
      console.error('⚠️ Forcefully terminating server after timeout.')
      process.exit(1)
    }, 5000).unref()
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  return server
}

// Run server directly when launched via CLI
if (process.argv[1]?.includes('server')) {
  startServer()
}

export default apiApp
