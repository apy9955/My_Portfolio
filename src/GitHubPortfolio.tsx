import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Code2, GitFork, Github, Linkedin, Mail, MapPin, Search, Sparkles, Star, X } from 'lucide-react'
import { featuredNames, githubProfile, repositoryPath } from './github-profile'
import { categorize, repositoryCategories, type RepositoryCategory } from './repository-categories'
import { profile, repositories, repositoryReadme, type Repository } from './services/github'
import { RepoVisualization } from './ProjectVisualizations'

type Resource<T> = { saved: () => T | undefined; load: (force?: boolean) => Promise<T> }

function useGitHubResource<T>(resource: Resource<T>) {
  const [state, setState] = useState({ data: resource.saved(), loading: true, failed: false })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setState({ data: resource.saved(), loading: true, failed: false })
    resource.load(attempt > 0).then(data => {
      if (active) setState({ data, loading: false, failed: false })
    }).catch(() => {
      if (active) setState({ data: resource.saved(), loading: false, failed: true })
    })
    return () => { active = false }
  }, [resource, attempt])
  return { ...state, retry: () => setAttempt(value => value + 1) }
}

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' })
const featuredSet = new Set(featuredNames.map(name => name.toLowerCase()))

function featuredProjects(entries: Repository[]) {
  const byName = new Map(entries.map(repo => [repo.name.toLowerCase(), repo]))
  return featuredNames.flatMap(name => {
    const repo = byName.get(name.toLowerCase())
    return repo ? [repo] : []
  })
}

function nameDescription(repo: Repository) {
  return repo.name.toLowerCase() === 'agentic-ai-engineering-lab'
    ? 'CampusBites Multi-Agent AI Engineering Lab.'
    : repo.description || 'No description provided on GitHub.'
}

function RepoMetadata({ repo }: { repo: Repository }) {
  return <ul className="repo-meta" aria-label="Repository metadata">
    <li><Code2 size={14} />{repo.language || 'Language unspecified'}</li>
    <li><Star size={14} /><span className="sr-only">Stars </span>{repo.stargazers_count}</li>
    <li><GitFork size={14} /><span className="sr-only">Forks </span>{repo.forks_count}</li>
    <li><time dateTime={repo.updated_at}>Updated {dateFormat.format(new Date(repo.updated_at))}</time></li>
  </ul>
}

export function GitHubRepositoryCard({ repo, featured = false, index = 0 }: { repo: Repository; featured?: boolean; index?: number }) {
  const [category] = categorize(repo)
  return <motion.article className={`glass repo-card${featured ? ' repo-featured' : ''}`}
    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .05 }}
    transition={{ duration: .28, delay: Math.min(index, 3) * .04 }}>
    <div className="repo-card-top"><div className="icon-tile"><Github size={21} /></div><span className="tag">{category}</span></div>
    <RepoVisualization repo={repo} />
    <h3>{repo.name}</h3>
    <p>{nameDescription(repo)}</p>
    <RepoMetadata repo={repo} />
    <div className="repo-actions">
      <a className="text-link repo-main-link" href={repo.html_url} target="_blank" rel="noopener noreferrer" aria-label={`View ${repo.name} on GitHub (opens in a new tab)`}>
        View on GitHub <ArrowUpRight size={15} />
      </a>
      {featured && <Link className="repo-details-link" to={repositoryPath(repo.name)} aria-label={`View details for ${repo.name}`}>Details <ArrowUpRight size={13} /></Link>}
    </div>
  </motion.article>
}

export function FeaturedProjectCard({ repo, index }: { repo: Repository; index: number }) {
  return <GitHubRepositoryCard repo={repo} featured index={index} />
}

export function RepositoryGrid({ entries, featured = false }: { entries: Repository[]; featured?: boolean }) {
  return <div className="project-grid repository-grid">{entries.map((repo, index) =>
    featured ? <FeaturedProjectCard key={repo.id} repo={repo} index={index} /> : <GitHubRepositoryCard key={repo.id} repo={repo} index={index} />,
  )}</div>
}

export function RepositorySearch({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  return <label className="repo-search">
    <Search size={18} aria-hidden="true" /><span className="sr-only">Search repositories</span>
    <input type="search" placeholder="Search by name or description" value={query} onChange={event => setQuery(event.target.value)} />
    {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button>}
  </label>
}

type Filter = 'All Projects' | RepositoryCategory
export function RepositoryFilters({ filter, setFilter }: { filter: Filter; setFilter: (category: Filter) => void }) {
  const choices: Filter[] = ['All Projects', ...repositoryCategories]
  return <div className="repo-filters" role="group" aria-label="Filter by repository category">{choices.map(category =>
    <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>,
  )}</div>
}

export function GitHubRepositoryCatalog() {
  const state = useGitHubResource(repositories)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('All Projects')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const search = query.trim().toLowerCase()
  const entries = (state.data ?? []).filter(repo => {
    const matchesCategory = filter === 'All Projects' || categorize(repo).includes(filter)
    const matchesSearch = `${repo.name} ${repo.description ?? ''}`.toLowerCase().includes(search)
    return matchesCategory && matchesSearch
  })
  const picks = featuredProjects(entries)
  const remaining = featuredOnly ? [] : entries.filter(repo => !featuredSet.has(repo.name.toLowerCase()))
  const found = picks.length + remaining.length
  return <>
    <div className="glass repo-toolbar">
      <div className="repo-toolbar-top">
        <RepositorySearch query={query} setQuery={setQuery} />
        <div className="repo-view" role="group" aria-label="Repository view">
          <button type="button" aria-pressed={!featuredOnly} onClick={() => setFeaturedOnly(false)}>All Repositories</button>
          <button type="button" aria-pressed={featuredOnly} onClick={() => setFeaturedOnly(true)}>Featured Projects</button>
        </div>
      </div>
      <RepositoryFilters filter={filter} setFilter={setFilter} />
    </div>
    <div className="repo-status" aria-live="polite">
      {state.loading ? <p>Checking GitHub for updates…</p> : <p>{found} {found === 1 ? 'repository' : 'repositories'} shown</p>}
      {state.failed && <p>GitHub is temporarily unavailable. Showing saved repository data. <button type="button" className="text-link" onClick={state.retry}>Retry</button></p>}
    </div>
    {picks.length > 0 && <section className="repo-section" aria-labelledby="featured-heading">
      <h2 id="featured-heading"><Sparkles size={24} /> Featured projects</h2><RepositoryGrid entries={picks} featured />
    </section>}
    {remaining.length > 0 && <section className="repo-section" aria-labelledby="other-repositories">
      <h2 id="other-repositories">{picks.length ? 'More repositories' : 'Repositories'}</h2><RepositoryGrid entries={remaining} />
    </section>}
    {!state.loading && found === 0 && <div className="glass info-card">
      <h2>{state.data?.length ? 'No matching repositories' : 'No public repositories found'}</h2>
      {state.data?.length ? <button type="button" className="text-link" onClick={() => { setQuery(''); setFilter('All Projects'); setFeaturedOnly(false) }}>Reset search and filters</button> : null}
    </div>}
  </>
}

export function HomeRepositories() {
  const { data } = useGitHubResource(repositories)
  return <RepositoryGrid entries={featuredProjects(data ?? []).slice(0, 3)} featured />
}

export function GitHubProfileStats() {
  const stats = useGitHubResource(profile)
  const data = stats.data
  return <motion.section className="glass github-profile" aria-labelledby="github-profile-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
    <div className="github-profile-copy">
      <div className="eyebrow"><Github size={16} /> GitHub profile</div>
      <h2 id="github-profile-title">{githubProfile.name}</h2>
      <div className="profile-handle"><a href={githubProfile.url} target="_blank" rel="noopener noreferrer">@{githubProfile.username}</a><span>{githubProfile.pronouns}</span></div>
      <p>{githubProfile.tagline}</p>
      <p className="profile-location"><MapPin size={16} />{githubProfile.location}</p>
      <div className="profile-links">
        <a className="text-link" href={githubProfile.url} target="_blank" rel="noopener noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>
        <a className="text-link" href={githubProfile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a>
        <a className="text-link" href={`mailto:${githubProfile.email}`}><Mail size={16} /> {githubProfile.email}</a>
      </div>
    </div>
    <div className="profile-stats-wrap">
      {data && <dl className="profile-stats">
        <div><dt>Public repositories</dt><dd>{data.public_repos}</dd></div>
        <div><dt>Followers</dt><dd>{data.followers}</dd></div>
        <div><dt>Following</dt><dd>{data.following}</dd></div>
      </dl>}
      {stats.failed && <p className="repo-status">Showing saved GitHub stats. <button type="button" className="text-link" onClick={stats.retry}>Retry</button></p>}
    </div>
  </motion.section>
}

function Readme({ name, url }: { name: string; url: string }) {
  const state = useGitHubResource(repositoryReadme(name))
  return <section className="glass info-card repo-readme">
    <div className="repo-readme-title"><h2>README</h2><a className="text-link" href={url} target="_blank" rel="noopener noreferrer">Open on GitHub <ArrowUpRight size={15} /></a></div>
    {state.loading && !state.data ? <p role="status">Loading README…</p> : state.data ? <pre>{state.data}</pre>
      : state.failed ? <p>GitHub couldn’t load the README. <button className="text-link" type="button" onClick={state.retry}>Retry</button></p>
      : <p>GitHub has no README for this repository.</p>}
  </section>
}

export function GitHubProjectDetails({ missing }: { missing: ReactNode }) {
  const { name } = useParams()
  const state = useGitHubResource(repositories)
  const repo = state.data?.find(entry => entry.name.toLowerCase() === name?.toLowerCase())
  useEffect(() => {
    if (repo) document.title = `${repo.name} · Aman Kumar`
  }, [repo])
  if (!repo) {
    if (state.loading) return <p className="container interior" role="status">Loading GitHub project…</p>
    return missing
  }
  return <article className="container interior">
    <Link className="text-link back-link" to="/projects"><ArrowLeft size={16} /> Back to projects</Link>
    <header className="page-heading repo-detail-heading">
      <div className="eyebrow"><Github size={18} />{categorize(repo).join(' · ')}</div>
      <h1>{repo.name}</h1>
      <p>{nameDescription(repo)}</p>
    </header>
    <div className="glass info-card repo-overview">
      <RepoMetadata repo={repo} />
      <a className="button primary" href={repo.html_url} target="_blank" rel="noopener noreferrer"><Github size={17} /> View on GitHub <ArrowUpRight size={17} /></a>
    </div>
    <div className="glass info-card repo-detail-vis-card" style={{ marginTop: 20 }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}><Sparkles size={16} /> Interactive Model & Workflow Visualization</div>
      <RepoVisualization repo={repo} />
    </div>
    <Readme key={repo.name} name={repo.name} url={repo.html_url} />
  </article>
}
