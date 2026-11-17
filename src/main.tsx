import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Braces, Code2, Database, Github, Globe2, Layers, Linkedin, Mail, Menu, Orbit, Pause, Play, PanelsTopLeft, Sparkles, Target, Users, Wrench, X } from 'lucide-react'
import SolarSystem, { orbitTargets } from './SolarSystem'
import { about, contact, projects, skills, type Project } from './data'
import { GitHubProfileStats, GitHubProjectDetails, GitHubRepositoryCatalog, HomeRepositories } from './GitHubPortfolio'
import DeveloperDashboard from './DeveloperDashboard'
import AcademicProfile from './AcademicProfile'
import { TechnicalProfilePage } from './TechnicalProfile'
import { CinematicRevealTransition } from './CinematicRevealTransition'
import { ApyTerminal } from './ApyTerminal/ApyTerminal'
import UniversePage from './Universe/UniversePage'
import './styles.css'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Explore' },
  { to: '/universe', label: 'Universe' },
  { to: '/contact', label: 'Connect' },
]

function Brand() {
  return <Link to="/" className="brand-box" aria-label="Aman Kumar, home">
    <div className="brand-logo-badge" aria-hidden="true">AK</div>
    <span className="brand-name">Aman Kumar</span>
  </Link>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])

  return <header className="site-header">
    <div className="nav-shell">
      {/* LEFT: AK logo and Aman Kumar inside one independent rounded rectangle box */}
      <div className="nav-left">
        <Brand />
      </div>

      {/* CENTER: Home, About, Projects, skills and Connect inside ONE SINGLE shared rounded rectangle container */}
      <div className="nav-center">
        <nav id="primary-nav" className="nav-center-box" aria-label="Main navigation">
          {navigation.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* RIGHT: Get in Touch inside its own independent rounded rectangle button */}
      <div className="nav-right">
        <Link to="/contact" className="nav-cta-box" aria-label="Get in Touch">
          <span>Get in Touch</span>
          <ArrowUpRight size={14} />
        </Link>
        <button
          type="button"
          className="mobile-toggle"
          aria-controls="mobile-nav"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </div>

    {/* Responsive Mobile Menu */}
    {open && (
      <div id="mobile-nav" className="mobile-nav-panel">
        {navigation.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <Link to="/contact" className="mobile-cta-link" onClick={() => setOpen(false)}>
          <span>Get in Touch</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    )}
  </header>
}

function ProjectVisual({ project }: { project: Project }) {
  const Icon = project.slug === 'markhecx' ? Sparkles : project.slug === 'byte-forge' ? Braces : Users
  return <div className={`project-visual ${project.slug}`} aria-hidden="true">
    <div className="visual-grid" />
    <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
    <div className="visual-emblem"><Icon strokeWidth={1.3} size={42} /></div>
  </div>
}

function ExternalAction({ href, children }: { href?: string; children: ReactNode }) {
  return href
    ? <a className="secondary-action" href={href} target="_blank" rel="noreferrer">{children}</a>
    : <span className="secondary-action unavailable" tabIndex={0} aria-disabled="true" title="Link pending">{children}<span className="sr-only"> — link pending</span></span>
}

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .12 },
  transition: { duration: .4 },
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <motion.article className="project-card glass" {...reveal} transition={{ duration: .42, delay: index * .07 }}>
    <Link className="project-image-link" to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
      {project.screenshots[0] ? <img className="project-thumbnail" loading="lazy" src={project.screenshots[0].src} alt={project.screenshots[0].alt} /> : <ProjectVisual project={project} />}
    </Link>
    <div className="project-copy">
      <div className="eyebrow">{project.category}</div>
      <h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3>
      <p>{project.description}</p>
      <div className="tag-row">{project.stack.length ? project.stack.map(item => <span key={item} className="tag">{item}</span>) : <span className="tag">Stack details pending</span>}</div>
      <div className="project-actions">
        <ExternalAction href={project.github}><Github size={15} /> GitHub</ExternalAction>
        <ExternalAction href={project.demo}><Globe2 size={15} /> Live demo</ExternalAction>
      </div>
      <Link className="text-link details-link" to={`/projects/${project.slug}`}>View details <ArrowUpRight size={16} /></Link>
    </div>
  </motion.article>
}

function ProjectGrid({ entries = projects }: { entries?: Project[] }) {
  return <div className="project-grid">{entries.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
}

function Home() {
  return <>
    <section className="container hero" aria-labelledby="hero-title">
      <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .09 } } }}>
        {[
          <div className="availability"><span className="status-dot" /> Available for opportunities</div>,
          <h1 id="hero-title">Hi, I’m <span>Aman.</span></h1>,
          <p className="hero-role"><span>Developer</span><i /> <span>Creative Technologist</span><i /> <span>Problem Solver</span></p>,
          <p className="hero-description">I build digital experiences, intelligent applications, and interactive web products that combine technology with creativity.</p>,
          <div className="hero-actions"><a href="#analytics-dashboard" className="button primary">View Analytics <ArrowDown size={17} /></a><Link to="/projects" className="button ghost">Explore Projects <ArrowUpRight size={17} /></Link></div>,
        ].map((element, index) => <motion.div key={index} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: .43 } } }}>{element}</motion.div>)}
      </motion.div>
      <div className="hero-bottom">
        <a className="scroll-link" href="#analytics-dashboard"><ArrowDown size={14} /> Scroll to explore analytics</a>
      </div>
    </section>

    <div className="container">
      <DeveloperDashboard />
    </div>

    <section className="container home-work" id="selected-work" aria-labelledby="work-title">
      <div className="section-bar"><div><div className="eyebrow"><span className="line" /> Portfolio Highlights</div><h2 id="work-title">Featured Repositories</h2></div><Link to="/projects" className="text-link">All projects <ArrowUpRight size={17} /></Link></div>
      <HomeRepositories />
    </section>
  </>
}

function PageHeading({ label, title, description }: { label: string; title: string; description?: string }) {
  return <header className="page-heading">
    <div className="eyebrow"><span className="line" />{label}</div>
    <h1>{title}</h1>
    {description && <p>{description}</p>}
  </header>
}

function About() {
  return (
    <section className="container interior" aria-labelledby="academic-profile-title">
      <AcademicProfile />
    </section>
  )
}

function Projects() {
  return <section className="container interior">
    <PageHeading label="Portfolio" title="Projects" description="Explore Aman Kumar’s public GitHub repositories in AI, machine learning, analytics, and software development." />
    <GitHubRepositoryCatalog />
  </section>
}

function ProjectDetails() {
  const { slug } = useParams()
  const project = projects.find(item => item.slug === slug)
  if (!project) return <NotFound />
  return <article className="container interior">
    <Link className="text-link back-link" to="/projects"><ArrowLeft size={16} /> Back to projects</Link>
    <div className="detail-hero">
      <div><PageHeading label={project.category} title={project.title} description={project.description} />
        <div className="project-actions">
          <ExternalAction href={project.github}><Github size={17} /> GitHub repository</ExternalAction>
          <ExternalAction href={project.demo}><Globe2 size={17} /> Live demo</ExternalAction>
        </div>
      </div>
      <ProjectVisual project={project} />
    </div>
    <div className="detail-grid">
      {[
        { title: 'Problem', copy: project.problem },
        { title: 'Solution', copy: project.solution },
        { title: 'Development process', copy: project.process || 'Development notes are pending.' },
        { title: 'My contributions', copy: project.contributions || 'Contribution details are pending.' },
      ].map(({ title, copy }) => <motion.section {...reveal} key={title} className="glass info-card"><h2>{title}</h2><p>{copy}</p></motion.section>)}
      <motion.section {...reveal} className="glass info-card"><h2>Key features</h2><ul className="features">{project.focus.map(item => <li key={item}>{item}</li>)}</ul></motion.section>
      <motion.section {...reveal} className="glass info-card"><h2>Technologies</h2>{project.stack.length ? <div className="tag-row">{project.stack.map(item => <span className="tag" key={item}>{item}</span>)}</div> : <p>Technology details are pending.</p>}</motion.section>
    </div>
    <motion.section {...reveal} className="glass info-card gallery"><h2>Project gallery</h2>
      {project.screenshots.length ? <div className="gallery-grid">{project.screenshots.map(image => <img key={image.src} loading="lazy" src={image.src} alt={image.alt} />)}</div> : <p>Screenshots are pending.</p>}
    </motion.section>
    <section className="related"><h2>Related projects</h2><ProjectGrid entries={projects.filter(item => item.slug !== slug)} /></section>
  </article>
}

function Skills() {
  return <TechnicalProfilePage />
}

function Contact() {
  const [notice, setNotice] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus('error')
      setNotice('Please fill out all fields before submitting.')
      return
    }

    setStatus('submitting')
    setNotice('Transmitting message to Aman...')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setStatus('success')
        setNotice(result.message || '✓ Message recorded successfully in the database! Aman reviews inquiries regularly.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setNotice(result.error || 'Server error. You can still use the direct email draft below.')
      }
    } catch {
      // Graceful offline fallback
      setStatus('error')
      setNotice('Network is offline or backend unreachable. Use the direct email draft option below.')
    }
  }

  function openMailDraft() {
    if (!contact.email) {
      setNotice('A contact email hasn’t been configured yet.')
      return
    }
    const subject = encodeURIComponent(formData.subject || 'Portfolio Inquiry')
    const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`)
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
  }

  return <section className="container interior">
    <PageHeading label="Contact" title="Let’s connect." description="Have a project in mind or want to talk about working together? I’d love to hear from you." />
    <div className="contact-grid">
      <div className="glass info-card contact-channels">
        <h2>Find me</h2>
        {[
          { label: 'Email', value: contact.email, href: contact.email && `mailto:${contact.email}`, icon: Mail },
          { label: 'GitHub', value: contact.github, href: contact.github, icon: Github },
          { label: 'LinkedIn', value: contact.linkedin, href: contact.linkedin, icon: Linkedin },
        ].map(({ label, value, href, icon: Icon }) => <div className="contact-channel" key={label}>
          <div className="icon-tile"><Icon size={20} /></div><div><h3>{label}</h3>{href ? <a className="text-link" href={href}>{label === 'Email' ? value : 'View profile'} <ArrowUpRight size={14} /></a> : <p>{label === 'Email' ? 'Address pending' : 'Profile link pending'}</p>}</div>
        </div>)}
      </div>
      <form className="glass info-card contact-form" onSubmit={handleSubmit}>
        <h2>Write a message</h2>
        <div className="form-row">
          <label>Name
            <input
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </label>
          <label>Email
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </label>
        </div>
        <label>Subject
          <input
            name="subject"
            placeholder="What’s on your mind?"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </label>
        <label>Message
          <textarea
            name="message"
            placeholder="Tell me a little about your idea…"
            rows={5}
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            required
          />
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="button primary" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending message...' : 'Send message'} <ArrowUpRight size={17} />
          </button>
          {contact.email && (
            <button
              type="button"
              className="button secondary"
              onClick={openMailDraft}
              title="Open draft in your local email app"
              style={{ fontSize: '13px', padding: '9px 14px' }}
            >
              Open email draft
            </button>
          )}
        </div>
        <p className={`form-status ${status}`} role="status">
          {notice || 'Messages are securely saved and delivered directly to Aman.'}
        </p>
      </form>
    </div>
  </section>
}

function NotFound() {
  return <section className="container interior">
    <PageHeading label="404" title="Page not found" description="This address is outside the portfolio." />
    <Link to="/" className="button primary"><ArrowLeft size={17} /> Back home</Link>
  </section>
}

function Foreground() {
  const location = useLocation()
  const path = location.pathname.replace(/\/+$/, '') || '/'
  const label = navigation.find(item => item.to === path)?.label
    ?? (path === '/explore' ? 'Explore' : undefined)
    ?? (path === '/universe' ? 'Universe' : undefined)
    ?? projects.find(item => path === `/projects/${item.slug}`)?.title
    ?? (path.startsWith('/projects/github/') ? 'GitHub project' : 'Page not found')

  useEffect(() => {
    document.title = label === 'Home' ? 'Aman Kumar — Developer & Creative Technologist' : `${label} · Aman Kumar`
    if (location.key !== 'default') document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [location.pathname, location.hash, location.key, label])

  return (
    <main id="main-content" tabIndex={-1}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -26 }}
          transition={{ duration: 0.36, ease: [0.25, 1, 0.4, 1] }}
          onAnimationStart={() => {
            if (!location.hash) {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
            }
          }}
          className="reveal-page-wrapper"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/explore" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
            <Route path="/projects/github/:name" element={<GitHubProjectDetails missing={<NotFound />} />} />
            <Route path="/universe" element={<UniversePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </main>
  )
}

function ScrollTextReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main .eyebrow, main .availability, main .tag, main .repo-meta, main .features li, main .profile-handle')
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.classList.toggle('text-in-view', entry.isIntersecting)
      }
    }, { threshold: .08 })
    for (const element of elements) {
      element.classList.add('scroll-pop-text')
      observer.observe(element)
    }
    const mutation = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main .eyebrow, main .tag, main .repo-meta').forEach(element => {
        if (!element.classList.contains('scroll-pop-text')) {
          element.classList.add('scroll-pop-text')
          observer.observe(element)
        }
      })
    })
    const main = document.querySelector('main')
    if (main) mutation.observe(main, { childList: true, subtree: true })
    return () => { observer.disconnect(); mutation.disconnect() }
  }, [pathname])
  return null
}

function App() {
  const [focus, setFocus] = useState('Scroll Journey')
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const { pathname } = useLocation()
  const isUniverse = pathname === '/universe'

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setPaused(preference.matches)
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])
  return <MotionConfig reducedMotion="user">
    <SolarSystem paused={paused} focus={focus} hidden={isUniverse} />
    <div className="space-overlay" aria-hidden="true" />
    <CinematicRevealTransition />
    <ApyTerminal />
    <div className={`site-content ${isUniverse ? 'is-universe-page' : ''}`}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <ScrollTextReveal />
      <Foreground />
      {!isUniverse && (
        <div className="orbit-controls" role="group" aria-label="Solar system controls">
          <label className="orbit-focus">
            <Orbit size={16} aria-hidden="true" />
            <span>Focus</span>
            <select value={focus} onChange={event => setFocus(event.target.value)}>
              {orbitTargets.map(body => <option key={body} value={body}>{body}</option>)}
            </select>
          </label>
          <button type="button" className="scene-label" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume solar system' : 'Pause solar system'}>
            {paused ? <Play size={14} /> : <Pause size={14} />}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      )}
      {!isUniverse && (
        <footer className="site-footer"><div className="container footer-inner"><Brand /><Link className="text-link" to="/contact">Get in touch <ArrowUpRight size={16} /></Link></div></footer>
      )}
    </div>
  </MotionConfig>
}

const root = createRoot(document.getElementById('root')!)
root.render(<BrowserRouter><App /></BrowserRouter>)
import.meta.hot?.dispose(() => root.unmount())
