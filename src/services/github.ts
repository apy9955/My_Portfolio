import { githubProfile } from '../github-profile'
import snapshot from './github-snapshot.json'
import contributionsSnapshot from './github-contributions-snapshot.json'

export interface Repository {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  html_url: string
  topics?: string[]
}

export interface ProfileStats {
  public_repos: number
  followers: number
  following: number
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface ContributionsData {
  total: Record<string, number>
  contributions: ContributionDay[]
}

export const fallbackRepositories: Repository[] = snapshot
export const fallbackStats: ProfileStats = { public_repos: snapshot.length, followers: 1, following: 0 }
export const fallbackContributions: ContributionsData = contributionsSnapshot as unknown as ContributionsData

const api = 'https://api.github.com'
const user = githubProfile.username
const ttl = 20 * 60 * 1000

type CacheEntry<T> = { savedAt: number; data: T }

function cachedResource<T>(name: string, request: () => Promise<T>, fallback?: T) {
  const key = `aman-portfolio:${user}:${name}:v1`
  let memory: CacheEntry<T> | undefined
  let pending: Promise<T> | undefined

  function read(): CacheEntry<T> | undefined {
    if (memory) return memory
    try {
      const value = localStorage.getItem(key)
      if (value) memory = JSON.parse(value) as CacheEntry<T>
    } catch {
      // The public API remains usable when browser storage is disabled.
    }
    return memory
  }

  return {
    saved() {
      const entry = read()
      return entry ? entry.data : fallback
    },
    load(force = false) {
      if (pending) return pending
      const entry = read()
      if (!force && entry && Date.now() - entry.savedAt < ttl) return Promise.resolve(entry.data)
      pending = request().then(data => {
        memory = { data, savedAt: Date.now() }
        try {
          localStorage.setItem(key, JSON.stringify(memory))
        } catch {
          // Keep the successful response in memory for the rest of the session.
        }
        return data
      }).finally(() => { pending = undefined })
      return pending
    },
  }
}

async function get(path: string, accept = 'application/vnd.github+json') {
  return fetch(`${api}${path}`, { headers: { Accept: accept }, signal: AbortSignal.timeout(10000) })
}

async function listRepositories(): Promise<Repository[]> {
  const repos = new Map<number, Repository>()
  const perPage = 100
  let page = 1
  while (true) {
    const response = await get(`/users/${user}/repos?per_page=${perPage}&sort=updated&page=${page}`)
    if (!response.ok) throw new Error(`GitHub repositories returned HTTP ${response.status}.`)
    const batch: Repository[] = await response.json()
    for (const repo of batch) {
      const { id, name, description, language, stargazers_count, forks_count, updated_at, html_url, topics } = repo
      repos.set(id, { id, name, description, language, stargazers_count, forks_count, updated_at, html_url, topics })
    }
    if (batch.length < perPage) break
    page++
  }
  return [...repos.values()].sort((a, b) => b.updated_at.localeCompare(a.updated_at))
}

export const repositories = cachedResource('repos', listRepositories, fallbackRepositories)
export const profile = cachedResource('profile', async () => {
  try {
    const backendRes = await fetch('/api/github/stats', { signal: AbortSignal.timeout(4000) })
    if (backendRes.ok) {
      const json = await backendRes.json()
      if (json.success && json.profile) return json.profile as ProfileStats
    }
  } catch {
    // Backend offline; continue to direct GitHub API
  }
  const response = await get(`/users/${user}`)
  if (!response.ok) throw new Error(`GitHub profile returned HTTP ${response.status}.`)
  const { public_repos, followers, following }: ProfileStats = await response.json()
  return { public_repos, followers, following }
}, fallbackStats)

export const contributions = cachedResource<ContributionsData>('contributions', async () => {
  try {
    const backendRes = await fetch('/api/github/stats', { signal: AbortSignal.timeout(4000) })
    if (backendRes.ok) {
      const json = await backendRes.json()
      if (json.success && json.contributions) return json.contributions as ContributionsData
    }
  } catch {
    // Backend offline; continue to direct contributions API
  }
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}`, {
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`GitHub contributions returned HTTP ${response.status}.`)
  return response.json()
}, fallbackContributions)

const readmes = new Map<string, ReturnType<typeof cachedResource<string | null>>>()

export function repositoryReadme(name: string) {
  const cached = readmes.get(name)
  if (cached) return cached
  const resource = cachedResource(`readme:${name}`, async () => {
    const response = await get(`/repos/${user}/${encodeURIComponent(name)}/readme`, 'application/vnd.github.raw+json')
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`GitHub README returned HTTP ${response.status}.`)
    return response.text()
  })
  readmes.set(name, resource)
  return resource
}
