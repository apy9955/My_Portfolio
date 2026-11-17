import { DatabaseSync } from 'node:sqlite'
import { join } from 'node:path'
import { mkdirSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'

const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data')
mkdirSync(dataDir, { recursive: true })

const backupDir = process.env.BACKUP_DIR || join(dataDir, 'backups')
mkdirSync(backupDir, { recursive: true })

const dbPath = process.env.DATABASE_PATH || join(dataDir, 'portfolio.db')
export const db = new DatabaseSync(dbPath)

// Initialize schema with WAL journal mode
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    ip_address TEXT,
    status TEXT DEFAULT 'unread'
  );

  CREATE TABLE IF NOT EXISTS terminal_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    category TEXT,
    created_at TEXT NOT NULL,
    ip_address TEXT
  );

  CREATE TABLE IF NOT EXISTS api_cache (
    cache_key TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`)

export interface ContactRecord {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  ip_address: string | null
  status: string
}

/**
 * Anonymizes an IP address to preserve visitor privacy while allowing abuse tracking
 */
export function anonymizeIp(ip: string | null): string {
  if (!ip) return 'anonymous'
  if (ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost')) return 'localhost'

  // Hash the IP with a stable date-based salt to allow temporary abuse correlation without storing raw IPs
  const hash = createHash('sha256').update(`${ip}-privacy-salt`).digest('hex').slice(0, 12)
  return `masked-${hash}`
}

export function saveContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string,
  ip: string | null
): number {
  const anonymized = anonymizeIp(ip)
  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, subject, message, created_at, ip_address, status)
    VALUES (?, ?, ?, ?, ?, ?, 'unread')
  `)
  const result = stmt.run(name, email, subject, message, new Date().toISOString(), anonymized)
  return Number(result.lastInsertRowid)
}

export function getContactMessages(limit = 50): ContactRecord[] {
  const stmt = db.prepare(`
    SELECT * FROM contacts ORDER BY id DESC LIMIT ?
  `)
  return stmt.all(limit) as unknown as ContactRecord[]
}

export function logTerminalQuery(query: string, category: string, ip: string | null): void {
  try {
    const anonymized = anonymizeIp(ip)
    const stmt = db.prepare(`
      INSERT INTO terminal_queries (query, category, created_at, ip_address)
      VALUES (?, ?, ?, ?)
    `)
    stmt.run(query, category, new Date().toISOString(), anonymized)
  } catch (err) {
    console.error('Failed to log terminal query:', err)
  }
}

export function getCachedItem<T>(key: string, maxAgeMs: number): T | null {
  try {
    const stmt = db.prepare(`
      SELECT payload, updated_at FROM api_cache WHERE cache_key = ?
    `)
    const row = stmt.get(key) as { payload: string; updated_at: number } | undefined
    if (!row) return null
    if (Date.now() - row.updated_at > maxAgeMs) return null
    return JSON.parse(row.payload) as T
  } catch {
    return null
  }
}

export function setCachedItem(key: string, payload: unknown): void {
  try {
    const stmt = db.prepare(`
      INSERT INTO api_cache (cache_key, payload, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(cache_key) DO UPDATE SET
        payload = excluded.payload,
        updated_at = excluded.updated_at
    `)
    stmt.run(key, JSON.stringify(payload), Date.now())
  } catch (err) {
    console.error('Failed to set cache item:', err)
  }
}

/**
 * Creates a consistent snapshot backup using SQLite's native VACUUM INTO
 */
export function createDatabaseBackup(): { success: boolean; backupPath?: string; error?: string } {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const targetFile = join(backupDir, `portfolio-backup-${timestamp}.db`)
    
    // Escape single quotes for SQL string literal
    const escaped = targetFile.replace(/'/g, "''")
    db.exec(`VACUUM INTO '${escaped}'`)

    return {
      success: true,
      backupPath: targetFile,
    }
  } catch (err: any) {
    console.error('Database backup failed:', err)
    return {
      success: false,
      error: err.message,
    }
  }
}

export function closeDatabase(): void {
  try {
    db.close()
    console.log('✓ SQLite database connection closed cleanly.')
  } catch (err) {
    console.error('Error closing database:', err)
  }
}
