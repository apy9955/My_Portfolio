import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  Database,
  Flame,
  GitBranch,
  GitCommit,
  GitFork,
  GitPullRequest,
  Github,
  Globe2,
  Layers,
  LineChart,
  Orbit,
  PieChart,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { projects } from './data'
import { githubProfile } from './github-profile'
import { categorize, repositoryCategories, type RepositoryCategory } from './repository-categories'
import {
  repositories,
  profile,
  contributions,
  type Repository,
  type ContributionDay,
} from './services/github'

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.45 },
}

// Hook to load cached / live resources
function useResource<T>(resource: { saved: () => T | undefined; load: () => Promise<T> }) {
  const [data, setData] = useState<T | undefined>(() => resource.saved())
  const [loading, setLoading] = useState(true)

  useState(() => {
    let mounted = true
    resource.load().then(result => {
      if (mounted) {
        setData(result)
        setLoading(false)
      }
    }).catch(() => {
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  })

  return { data, loading }
}

// Color palettes for categories & languages
const CATEGORY_COLORS: Record<string, string> = {
  'Artificial Intelligence': '#00f0ff',
  'Machine Learning': '#8b5cf6',
  'Data Science': '#a78bfa',
  'Python': '#3b82f6',
  'Web Development': '#10b981',
  'Data Analytics': '#f59e0b',
  'C / C++': '#ef4444',
  'Other': '#64748b',
}

const LANGUAGE_COLORS: Record<string, string> = {
  'Python': '#3b82f6',
  'Jupyter Notebook': '#f59e0b',
  'C++': '#f43f5e',
  'C': '#ef4444',
  'TypeScript': '#00f0ff',
  'JavaScript': '#eab308',
  'HTML': '#ec4899',
  'Other': '#64748b',
}

/* =========================================================================
   1. Interactive Donut Chart for Categories
   ========================================================================= */
function CategoryDonutChart({ repos }: { repos: Repository[] }) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const distribution = useMemo(() => {
    const counts: Record<string, number> = {}
    repos.forEach(repo => {
      const cats = categorize(repo)
      const primary = cats[0] || 'Other'
      counts[primary] = (counts[primary] || 0) + 1
    })

    const total = repos.length || 1
    let cumulativeAngle = 0

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => {
        const percentage = Math.round((count / total) * 100)
        const sliceAngle = (count / total) * 360
        const startAngle = cumulativeAngle
        cumulativeAngle += sliceAngle
        return {
          name,
          count,
          percentage,
          color: CATEGORY_COLORS[name] || '#00f0ff',
          startAngle,
          endAngle: cumulativeAngle,
        }
      })
  }, [repos])

  const activeCategory = hoveredCategory
    ? distribution.find(d => d.name === hoveredCategory)
    : distribution[0]

  return (
    <div className="glass p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90" aria-label="Category distribution donut chart" role="img">
          {distribution.map(item => {
            const r = 38
            const cx = 50
            const cy = 50
            const circumference = 2 * Math.PI * r
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((item.startAngle / 360) * circumference)
            const isHovered = hoveredCategory === item.name

            return (
              <circle
                key={item.name}
                cx={cx}
                cy={cy}
                r={r}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? 14 : 10}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${item.color})` : 'none',
                  opacity: hoveredCategory && !isHovered ? 0.45 : 1,
                }}
                onMouseEnter={() => setHoveredCategory(item.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            )
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          <span className="text-xs font-mono text-gray-400">
            {activeCategory?.name.split(' ')[0] || 'Total'}
          </span>
          <span className="text-2xl font-bold font-mono text-white glow-text">
            {activeCategory ? `${activeCategory.count}` : repos.length}
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            {activeCategory ? `${activeCategory.percentage}%` : 'Repositories'}
          </span>
        </div>
      </div>

      {/* Accessible Interactive Legend */}
      <div className="flex-1 w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-white/10 pb-2">
          <span>Project Category</span>
          <span>Repos / Ratio</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {distribution.map(item => {
            const isHovered = hoveredCategory === item.name
            return (
              <button
                key={item.name}
                type="button"
                className={`flex items-center justify-between p-2 rounded-lg text-left text-xs font-mono transition-all border ${
                  isHovered
                    ? 'bg-slate-800/80 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20'
                }`}
                onMouseEnter={() => setHoveredCategory(item.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color, boxShadow: isHovered ? `0 0 8px ${item.color}` : 'none' }}
                  />
                  <span className="text-gray-200 truncate">{item.name}</span>
                </div>
                <span className="text-cyan-300 ml-2 font-bold flex-shrink-0">
                  {item.count} <span className="text-[10px] text-gray-400 font-normal">({item.percentage}%)</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   2. GitHub Contribution Heatmap (Real 2026 Data)
   ========================================================================= */
function ContributionHeatmap({ days, totalCount }: { days: ContributionDay[]; totalCount: number }) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null)

  // Filter 2026 days and group into weeks (columns)
  const { weeks, monthLabels, activeDays, peakDay } = useMemo(() => {
    const filtered = days.filter(d => d.date.startsWith('2026-'))
    const weeksArr: ContributionDay[][] = []
    let currentWeek: ContributionDay[] = []

    let activeCount = 0
    let maxDay = { date: '', count: 0 }

    filtered.forEach(day => {
      if (day.count > 0) activeCount++
      if (day.count > maxDay.count) maxDay = { date: day.date, count: day.count }

      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek)
        currentWeek = []
      }
    })
    if (currentWeek.length) weeksArr.push(currentWeek)

    // Month headers
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return {
      weeks: weeksArr,
      monthLabels: months,
      activeDays: activeCount,
      peakDay: maxDay,
    }
  }, [days])

  const getLevelColor = (level: number, count: number) => {
    if (count === 0 || level === 0) return 'rgba(13, 17, 23, 0.9)'
    if (level === 1) return '#004d54'
    if (level === 2) return '#00828a'
    if (level === 3) return '#00b8c4'
    return '#00f0ff'
  }

  return (
    <div className="glass p-6 rounded-2xl relative space-y-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <GitCommit size={14} />
            <span>2026 Activity Telemetry</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            {totalCount} Contributions in 2026
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-cyan-500/20">
            <span className="text-cyan-400 font-bold">{activeDays}</span>
            <span className="text-gray-400">Active Days</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-amber-500/20">
            <Flame size={13} className="text-amber-400" />
            <span className="text-amber-300 font-bold">{peakDay.count}</span>
            <span className="text-gray-400">Peak in 1 Day</span>
          </div>
        </div>
      </div>

      {/* Month Labels Bar */}
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="min-w-[680px]">
          <div className="flex justify-between text-[11px] font-mono text-gray-400 px-6 mb-1">
            {monthLabels.map(m => <span key={m}>{m}</span>)}
          </div>

          {/* 7 rows x 52 columns grid */}
          <div className="flex gap-[3px] p-2 bg-slate-950/80 rounded-xl border border-white/10">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-[3px]">
                {week.map(day => (
                  <div
                    key={day.date}
                    tabIndex={0}
                    role="gridcell"
                    aria-label={`${day.count} contributions on ${day.date}`}
                    className="w-2.5 h-2.5 rounded-[2px] transition-transform hover:scale-125 focus:scale-125 cursor-pointer relative"
                    style={{
                      backgroundColor: getLevelColor(day.level, day.count),
                      border: day.count > 0 ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                      boxShadow: day.level >= 3 ? '0 0 6px rgba(0, 240, 255, 0.6)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      setTooltip({ date: day.date, count: day.count, x: rect.left + rect.width / 2, y: rect.top })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Footer Legend */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 pt-2">
        <span>Verified via GitHub APIv3</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-900 border border-white/10" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#004d54]" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00828a]" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00b8c4]" />
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00f0ff] shadow-sm shadow-cyan-400" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-mono border border-cyan-400 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <strong className="text-cyan-400">{tooltip.count} contribution{tooltip.count === 1 ? '' : 's'}</strong>
          <span className="text-gray-300 block text-[10px]">{tooltip.date}</span>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   3. Real Language Distribution Bar
   ========================================================================= */
function LanguageDistribution({ repos }: { repos: Repository[] }) {
  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {}
    repos.forEach(repo => {
      const lang = repo.language || 'Other'
      counts[lang] = (counts[lang] || 0) + 1
    })

    const total = repos.length || 1
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
        color: LANGUAGE_COLORS[name] || '#64748b',
      }))
  }, [repos])

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 size={18} className="text-cyan-400" />
          <span>Repository Language Breakdown</span>
        </h4>
        <span className="text-xs font-mono text-gray-400">{repos.length} Repositories</span>
      </div>

      {/* Segmented multi-color bar */}
      <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-900 border border-white/10" role="progressbar" aria-label="Language distribution">
        {languageStats.map(lang => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
            className="h-full transition-all duration-500 hover:brightness-125 relative group"
            title={`${lang.name}: ${lang.count} repos (${lang.percentage}%)`}
          />
        ))}
      </div>

      {/* Language tags list */}
      <div className="flex flex-wrap gap-2 pt-1">
        {languageStats.map(lang => (
          <div
            key={lang.name}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-white/10 text-xs font-mono"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
            <span className="text-gray-200">{lang.name}</span>
            <span className="text-cyan-400 font-bold ml-1">{lang.percentage}%</span>
            <span className="text-[10px] text-gray-500 font-normal">({lang.count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================================
   4. Technical Skills Analytics (Categorical Depth, No Fake Percentages)
   ========================================================================= */
const SKILL_DOMAINS = [
  {
    id: 'systems',
    name: 'Systems & Architecture',
    badge: 'Low-Latency & OS',
    icon: Terminal,
    color: 'border-amber-500/30 text-amber-400',
    description: 'High-concurrency systems, C/C++ architecture, process sandboxing, and operating system workflows.',
    skills: [
      { name: 'C', level: 'Core Architecture', context: 'Byte Forge competition platform for 60 concurrent users' },
      { name: 'C++', level: 'Algorithmic Systems', context: 'Competitive programming & algorithmic optimizations' },
      { name: 'Arch Linux', level: 'Daily Environment', context: 'Hyprland, Wayland tiling, Zen Kernel, and Zsh automation' },
      { name: 'Shell / Bash', level: 'Automation', context: 'Linux configuration, task scripting, build systems' },
      { name: 'GCC & Debugging', level: 'Toolchain', context: 'Automated test suite evaluation and error diagnostics' },
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI & Data Science',
    badge: 'Machine Intelligence',
    icon: Brain,
    color: 'border-cyan-500/30 text-cyan-400',
    description: 'Autonomous agentic pipelines, predictive machine learning models, and deep exploratory data analysis.',
    skills: [
      { name: 'Python', level: 'Production & Research', context: 'Agentic AI Lab, ML training scripts, data pipelines' },
      { name: 'Multi-Agent AI', level: 'Architecture', context: 'Autonomous LLM workflows, prompting, and tool execution' },
      { name: 'Scikit-learn', level: 'Machine Learning', context: 'Classification, regression, customer segmentation models' },
      { name: 'Jupyter & Pandas', level: 'Data Science', context: '15+ data analytics notebooks and statistical models' },
      { name: 'AI Portfolio Engine', level: 'Integration', context: 'MarkHECX intelligent profile generation' },
    ],
  },
  {
    id: 'web',
    name: 'Web Engineering & UI',
    badge: 'Interactive Frontends',
    icon: Globe2,
    color: 'border-purple-500/30 text-purple-400',
    description: 'Modern component-driven web applications, sub-second routing, and 3D WebGL visualizations.',
    skills: [
      { name: 'React 19', level: 'Component Architecture', context: 'Modern SPA development, state machines, hooks' },
      { name: 'TypeScript', level: 'Type Safety', context: 'Full codebase typing, interfaces, and API contracts' },
      { name: 'Three.js / WebGL', level: '3D Graphics', context: 'Interactive Solar System celestial simulation' },
      { name: 'Tailwind CSS 4', level: 'Design Systems', context: 'Futuristic glassmorphism, responsive grids, and tokens' },
      { name: 'Vite Bundler', level: 'Build Tooling', context: 'Fast HMR, route pre-rendering, code splitting' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Data Storage',
    badge: 'Data Integrity',
    icon: Database,
    color: 'border-emerald-500/30 text-emerald-400',
    description: 'Relational data modeling, concurrent session storage, and REST API design.',
    skills: [
      { name: 'MariaDB / MySQL', level: 'Relational Schemas', context: 'Student login, questions, and live leaderboard data' },
      { name: 'RESTful Architecture', level: 'API Design', context: 'Structured communication between clients and services' },
      { name: 'Real-time Messaging', level: 'Ecosystems', context: 'Student Community Platform chat and channels' },
      { name: 'Git & GitHub Workflows', level: 'Version Control', context: 'Branch management, pull requests, automated releases' },
    ],
  },
]

function TechnicalSkillsAnalytics() {
  const [selectedDomain, setSelectedDomain] = useState('systems')
  const activeDomain = SKILL_DOMAINS.find(d => d.id === selectedDomain) || SKILL_DOMAINS[0]

  return (
    <div className="glass p-6 sm:p-8 rounded-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Cpu size={14} />
            <span>Capability Matrix (Real Applications)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Technical Stack &amp; Applied Engineering
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {SKILL_DOMAINS.map(domain => {
            const Icon = domain.icon
            const isSelected = domain.id === selectedDomain
            return (
              <button
                key={domain.id}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30'
                    : 'bg-slate-900/60 text-gray-400 border-white/10 hover:text-white'
                }`}
                onClick={() => setSelectedDomain(domain.id)}
              >
                <Icon size={13} />
                <span>{domain.name.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeDomain.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{activeDomain.badge}</span>
              <h4 className="text-lg font-bold text-white">{activeDomain.name}</h4>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl">{activeDomain.description}</p>
            </div>
            <div className="text-xs font-mono text-gray-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
              {activeDomain.skills.length} Validated Skills
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeDomain.skills.map(skill => (
              <div
                key={skill.name}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 hover:border-cyan-500/30 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{skill.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {skill.level}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  <strong className="text-gray-300 font-normal">Applied in:</strong> {skill.context}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* =========================================================================
   5. Learning Journey & Trajectory Timeline
   ========================================================================= */
const LEARNING_INTERESTS = [
  {
    title: 'Agentic AI Systems',
    icon: Bot,
    tag: 'Artificial Intelligence',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    summary: 'Building multi-agent autonomous engineering labs, context orchestration, and intelligent portfolio identity generation.',
  },
  {
    title: 'Arch Linux & Hyprland',
    icon: Terminal,
    tag: 'Operating Environments',
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    summary: 'Tiling window managers, system monitoring, Zen kernel tuning, and deep shell automation with Zsh.',
  },
  {
    title: 'Systems & C Programming',
    icon: Cpu,
    tag: 'Low-Latency Software',
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    summary: 'Low-level memory architectures, test case sandboxing, high-concurrency student competition engines.',
  },
  {
    title: 'Physics & Natural Philosophy',
    icon: Atom,
    tag: 'Simultaneous B.Sc.',
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    summary: 'Pursuing simultaneous Bachelor of Science in Physics; investigating classical mechanics, quantum theory, and relativity.',
  },
  {
    title: 'Cosmology & Astrophysics',
    icon: Orbit,
    tag: 'Deep Space Science',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    summary: 'Stellar evolution, black hole dynamics, gravitational physics, and celestial Three.js WebGL simulations.',
  },
]

const TIMELINE_MILESTONES = [
  {
    year: '2024',
    phase: 'Phase 01',
    title: 'Foundations in Systems & Physics',
    badge: 'Academic & Code Inception',
    description: 'Enrolled in Engineering while simultaneously beginning a Bachelor of Science (B.Sc.) in Physics. Mastered C programming fundamentals, algorithmic problem solving, and classical mechanics principles.',
    tags: ['C Fundamentals', 'B.Sc. Physics', 'Data Structures', 'Linux Basics'],
  },
  {
    year: '2025',
    phase: 'Phase 02',
    title: 'Competition Engineering & Linux Mastery',
    badge: 'Platform Architect',
    description: 'Engineered Byte Forge—a C programming contest platform hosting 60 concurrent students with automated testing and live standings. Adopted Arch Linux and Hyprland as primary engineering environment; built MariaDB relational schemas.',
    tags: ['Byte Forge (60 Users)', 'Arch Linux', 'Hyprland', 'MariaDB', 'HacXLerate 2026'],
  },
  {
    year: '2026',
    phase: 'Phase 03',
    title: 'AI Engineering, MarkHECX & Cosmos',
    badge: 'Current Frontier',
    description: 'Launched Agentic AI Engineering Lab and created MarkHECX—an AI-powered creator identity and portfolio platform. Developed 3D Solar System WebGL simulation and merged advanced machine learning research with astrophysics computing.',
    tags: ['MarkHECX', 'Agentic AI Lab', 'Three.js 3D', 'React 19 / Vite', 'Cosmology'],
  },
]

function LearningJourneyTimeline() {
  return (
    <div className="space-y-8">
      {/* 5 Focus Area Cards */}
      <div className="glass p-6 sm:p-8 rounded-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Compass size={14} />
            <span>Intellectual Frontiers</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Current Learning &amp; Research Interests
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 font-light">
            Merging computer science engineering with the fundamental laws of nature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {LEARNING_INTERESTS.map(interest => {
            const Icon = interest.icon
            return (
              <div
                key={interest.title}
                className="p-4 rounded-xl bg-slate-900/70 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-2.5 ${interest.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 block">{interest.tag}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{interest.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed mt-2 font-light">{interest.summary}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chronological Milestone Timeline */}
      <div className="glass p-6 sm:p-8 rounded-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Development Trajectory</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Learning Journey &amp; Milestones
          </h3>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l border-cyan-500/30 space-y-8 my-4">
          {TIMELINE_MILESTONES.map((milestone, idx) => (
            <div key={milestone.year} className="relative group">
              {/* Glowing Timeline Marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-md shadow-cyan-400/50">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-all space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                      {milestone.year}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{milestone.phase}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {milestone.badge}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white">{milestone.title}</h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">{milestone.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {milestone.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-[11px] font-mono border border-cyan-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   6. Main Developer Analytics Dashboard Section
   ========================================================================= */
export default function DeveloperDashboard() {
  const repoResource = useResource(repositories)
  const profileResource = useResource(profile)
  const contribResource = useResource(contributions)

  const repos = repoResource.data || []
  const contribData = contribResource.data || { total: { '2026': 233 }, contributions: [] }
  const total2026Contribs = contribData.total?.['2026'] ?? 233

  // Project metrics
  const totalCoreProjects = projects.length // 3
  const totalGithubRepos = repos.length || 26
  const combinedProjects = totalCoreProjects + totalGithubRepos // 29

  return (
    <section id="analytics-dashboard" className="space-y-10 my-16" aria-labelledby="dashboard-title">
      {/* Dashboard Top Command Header */}
      <motion.div {...reveal} className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-cyan-950/30 border border-cyan-500/30">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
                <Activity size={13} className="animate-pulse text-cyan-400" />
                <span>Live Engineering Telemetry</span>
              </div>
              <h2 id="dashboard-title" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Developer <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400 bg-clip-text text-transparent glow-text">Analytics Dashboard</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base font-light max-w-2xl mt-1">
                Real data visualization tracking project architecture, live GitHub activity, technical skill matrix, and physics-driven learning trajectory.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 font-bold text-xs font-mono shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 w-fit"
            >
              <span>Explore Dedicated Projects</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Top KPI Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-xs font-mono text-gray-400 block mb-1">Total Engineering Projects</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan-400 font-mono">{combinedProjects}</span>
                <span className="text-[11px] font-mono text-gray-400">(3 Core + 26 OSS)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-xs font-mono text-gray-400 block mb-1">2026 GitHub Commits</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{total2026Contribs}</span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
                  <Flame size={12} /> Active
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-xs font-mono text-gray-400 block mb-1">Project Completion Rate</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-300 font-mono">100%</span>
                <span className="text-[11px] font-mono text-gray-400">Deployed / Active</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
              <span className="text-xs font-mono text-gray-400 block mb-1">Academic &amp; Systems Pillars</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-purple-400 font-mono">4</span>
                <span className="text-[11px] font-mono text-gray-400">AI • C • Linux • Physics</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 1. Project Analytics: Categories Donut & Completed vs In-Progress */}
      <motion.div {...reveal} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart size={20} className="text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">Project Analytics</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">Architecture &amp; Delivery Status</span>
        </div>

        {/* Project Status Cards (Completed vs In-Progress) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-5 rounded-xl border-l-4 border-emerald-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400">Conducted &amp; Evaluated</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Byte Forge</h4>
            <p className="text-xs text-gray-300">
              C programming competition platform successfully hosted for 60 concurrent students with live automated grading.
            </p>
            <span className="inline-block text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
              Completed Deployment
            </span>
          </div>

          <div className="glass p-5 rounded-xl border-l-4 border-cyan-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400">Active Development</span>
              <Zap size={16} className="text-cyan-400 animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-white">MarkHECX</h4>
            <p className="text-xs text-gray-300">
              AI-powered creator identity and portfolio platform. Live pull requests and ongoing architecture iteration.
            </p>
            <span className="inline-block text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
              Active Sprint
            </span>
          </div>

          <div className="glass p-5 rounded-xl border-l-4 border-purple-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400">Concept &amp; Prototype</span>
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <h4 className="text-lg font-bold text-white">Student Community Hub</h4>
            <p className="text-xs text-gray-300">
              Real-time campus communication, study group channels, and peer resource repository.
            </p>
            <span className="inline-block text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
              Prototype Staging
            </span>
          </div>
        </div>

        {/* Category Donut Chart Component */}
        <CategoryDonutChart repos={repos} />
      </motion.div>

      {/* 2. GitHub Analytics: Heatmap & Language Breakdown */}
      <motion.div {...reveal} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github size={20} className="text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">GitHub Analytics</h3>
          </div>
          <a
            href={githubProfile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>@{githubProfile.username}</span>
            <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Contribution Heatmap */}
        <ContributionHeatmap days={contribData.contributions || []} totalCount={total2026Contribs} />

        {/* Language Distribution */}
        <LanguageDistribution repos={repos} />
      </motion.div>

      {/* 3. Technical Skills Analytics */}
      <motion.div {...reveal} className="space-y-6">
        <TechnicalSkillsAnalytics />
      </motion.div>

      {/* 4. Learning Journey & Cosmology Trajectory */}
      <motion.div {...reveal} className="space-y-6">
        <LearningJourneyTimeline />
      </motion.div>

      {/* Bottom Link to Dedicated Projects */}
      <motion.div {...reveal} className="glass p-8 rounded-2xl text-center space-y-4 border border-cyan-500/30">
        <h4 className="text-2xl font-bold text-white">Looking for the complete code showcases?</h4>
        <p className="text-sm text-gray-300 max-w-xl mx-auto font-light">
          Visit the dedicated Projects section to inspect in-depth case studies, problem statements, solutions, system architecture, and repository source code.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/projects"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <span>Open Dedicated Projects Catalog</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
