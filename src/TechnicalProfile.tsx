import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  Database,
  Layers,
  Wrench,
  Sparkles,
  ArrowUpRight,
  Star,
  Trophy,
  ExternalLink,
  CheckCircle2,
  Terminal,
  Server,
  Cpu,
  GitBranch,
} from 'lucide-react'
import codingProfilesSnapshot from './services/coding-profiles-snapshot.json'

// Animation variant for smooth reveals
const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.4 },
}

// 4 Verified Main Skill Categories
export const verifiedSkillCategories = [
  {
    id: 'programming-languages',
    title: 'Programming Languages',
    badge: 'CORE CODEBASES',
    accentColor: '#00f0ff',
    icon: Code2,
    description: 'Foundational systems and application languages verified across competitive coding, competitions, and machine learning pipelines.',
    skills: [
      { name: 'C', context: 'Byte Forge Competition Engine', highlight: true, dot: '#00f0ff' },
      { name: 'C++', context: 'LeetCode & Systems DSA', highlight: true, dot: '#00f0ff' },
      { name: 'Python', context: 'AI Labs, ML Models & Scripts', highlight: true, dot: '#c0a2ff' },
      { name: 'JavaScript', context: 'ES6+ & Modern Web Logic', highlight: false, dot: '#f0b429' },
      { name: 'HTML', context: 'Semantic Web & Documentation', highlight: false, dot: '#34d399' },
      { name: 'CSS', context: 'Tailwind & Glassmorphic UI', highlight: false, dot: '#38bdf8' },
    ],
  },
  {
    id: 'frontend-development',
    title: 'Frontend Development',
    badge: 'USER INTERFACES',
    accentColor: '#c0a2ff',
    icon: Layers,
    description: 'Interactive web applications, reactive components, fluid animations, and data visualization user interfaces.',
    skills: [
      { name: 'React', context: 'Component Architecture & Hooks', highlight: true, dot: '#00f0ff' },
      { name: 'Tailwind CSS', context: 'Modern Utility Styling', highlight: true, dot: '#38bdf8' },
      { name: 'Responsive Design', context: 'Mobile-first Grid & Flexbox', highlight: false, dot: '#c0a2ff' },
      { name: 'TypeScript', context: 'Type Safety & Interfaces', highlight: true, dot: '#3b82f6' },
      { name: 'Framer Motion', context: 'Compositor Animations', highlight: false, dot: '#ec4899' },
      { name: 'Streamlit', context: 'ML Web Apps & Dashboards', highlight: false, dot: '#f43f5e' },
      { name: 'Three.js / WebGL', context: '3D Solar System & Canvas', highlight: false, dot: '#f0b429' },
    ],
  },
  {
    id: 'backend-databases',
    title: 'Backend & Databases',
    badge: 'DATA & SERVICES',
    accentColor: '#f0b429',
    icon: Database,
    description: 'Structured querying, relational data modeling, data pipeline orchestration, and ML model inference services.',
    skills: [
      { name: 'Python Backend & APIs', context: 'REST Clients & Automation', highlight: true, dot: '#3b82f6' },
      { name: 'SQL', context: 'Complex Queries & Aggregations', highlight: true, dot: '#f0b429' },
      { name: 'MySQL / MariaDB', context: 'Relational Database Design', highlight: true, dot: '#0085a6' },
      { name: 'Scikit-Learn & XGBoost', context: 'Random Forest, K-Means & GBM', highlight: false, dot: '#f97316' },
      { name: 'Pandas & NumPy', context: 'Data Wrangling & Vectorization', highlight: false, dot: '#10b981' },
      { name: 'ETL Pipelines', context: 'Automated Cleaning & Reports', highlight: false, dot: '#c0a2ff' },
    ],
  },
  {
    id: 'tools-technologies',
    title: 'Tools & Technologies',
    badge: 'DEVELOPER WORKFLOW',
    accentColor: '#34d399',
    icon: Wrench,
    description: 'Development environment, Unix system administration, version control, and business intelligence toolchains.',
    skills: [
      { name: 'Git & GitHub', context: 'Distributed Version Control', highlight: true, dot: '#f05032' },
      { name: 'Linux', context: 'Command Line & Shell Scripting', highlight: true, dot: '#f0b429' },
      { name: 'Arch Linux', context: 'Custom Systems Environment', highlight: false, dot: '#1793d1' },
      { name: 'VS Code', context: 'Primary IDE & Debugger', highlight: false, dot: '#007acc' },
      { name: 'Jupyter Notebook', context: 'Exploratory Data Analysis', highlight: false, dot: '#f37626' },
      { name: 'Tableau & Looker Studio', context: 'Interactive BI Dashboards', highlight: false, dot: '#e97627' },
      { name: 'Vite', context: 'Modern Frontend Build Tool', highlight: false, dot: '#a855f7' },
    ],
  },
]

// Official LeetCode Brand SVG Icon
function LeetCodeIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863 0-.713.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.216 5.216 0 00-3.85-1.498 5.216 5.216 0 00-3.85 1.498L3.414 10.5c-1.03 1.03-1.6 2.45-1.6 3.96 0 1.513.57 2.932 1.6 3.962l4.319 4.38a5.408 5.408 0 003.85 1.501c1.472 0 2.89-.57 3.85-1.501l2.609-2.636c.514-.514.496-1.365-.039-1.9-.535-.536-1.386-.554-1.9.038v-.038z"
        fill="#FFA116"
      />
      <path
        d="M10.8 12.04h8.375c.742 0 1.345-.603 1.345-1.345s-.603-1.345-1.345-1.345H10.8c-.742 0-1.345.603-1.345 1.345s.603 1.345 1.345 1.345z"
        fill="#FAFAFA"
      />
    </svg>
  )
}

// Official HackerRank Brand SVG Icon
function HackerRankIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#00EA64" fillOpacity="0.15" />
      <path
        d="M7 6v12h3v-4.5h4V18h3V6h-3v4.5h-4V6H7z"
        fill="#00EA64"
      />
    </svg>
  )
}

// 1. Skills Section Component (4 Main Cards)
export const SkillsSection = memo(function SkillsSection() {
  return (
    <section className="skills-showcase" aria-labelledby="skills-heading">
      <div className="section-bar">
        <div>
          <div className="eyebrow"><span className="line" /> Technical Expertise</div>
          <h2 id="skills-heading">Core Skills & Applied Stack</h2>
        </div>
        <p className="skills-section-note">Verified from active repositories & production builds</p>
      </div>

      <div className="skills-cards-grid">
        {verifiedSkillCategories.map((group, index) => {
          const Icon = group.icon
          return (
            <motion.article
              key={group.id}
              className="glass skill-group-card"
              {...reveal}
              transition={{ duration: 0.38, delay: index * 0.08 }}
              style={{ '--group-accent': group.accentColor } as React.CSSProperties}
            >
              <div className="skill-group-header">
                <div className="icon-tile" style={{ color: group.accentColor, borderColor: `${group.accentColor}44`, background: `${group.accentColor}14` }}>
                  <Icon size={22} />
                </div>
                <div className="skill-group-title-wrap">
                  <span className="skill-group-badge">{group.badge}</span>
                  <h3>{group.title}</h3>
                </div>
              </div>

              <p className="skill-group-desc">{group.description}</p>

              <div className="skill-chips-wrap">
                {group.skills.map(skill => (
                  <div
                    key={skill.name}
                    className={`skill-chip ${skill.highlight ? 'skill-chip-highlight' : ''}`}
                    title={`${skill.name} — ${skill.context}`}
                  >
                    <span className="skill-chip-dot" style={{ backgroundColor: skill.dot }} />
                    <span className="skill-chip-name">{skill.name}</span>
                    <span className="skill-chip-context">{skill.context}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
})

// 2. Coding Profiles Section Component (HackerRank & LeetCode)
export const CodingProfilesSection = memo(function CodingProfilesSection() {
  const { leetcode, hackerrank } = codingProfilesSnapshot

  // Total LeetCode solved calculation
  const totalSolved = leetcode.totalSolved
  const easyPct = Math.round((leetcode.easySolved / totalSolved) * 100)
  const medPct = Math.round((leetcode.mediumSolved / totalSolved) * 100)
  const hardPct = Math.round((leetcode.hardSolved / totalSolved) * 100)

  return (
    <section className="coding-profiles-showcase" aria-labelledby="coding-profiles-heading">
      <div className="section-bar">
        <div>
          <div className="eyebrow"><span className="line" /> Competitive Programming</div>
          <h2 id="coding-profiles-heading">Coding Profiles</h2>
        </div>
        <p className="skills-section-note">Verifiable problem-solving track records on competitive platforms</p>
      </div>

      <div className="coding-profiles-grid">
        {/* Card 1: LeetCode */}
        <motion.article
          className="glass coding-profile-card profile-leetcode"
          {...reveal}
          transition={{ duration: 0.42, delay: 0.05 }}
        >
          <div className="profile-card-top">
            <div className="profile-platform-identity">
              <div className="platform-logo-tile leetcode-tile">
                <LeetCodeIcon size={28} />
              </div>
              <div>
                <span className="platform-tag">ALGORITHMS & DSA</span>
                <h3>LeetCode</h3>
                <span className="profile-username">@{leetcode.username}</span>
              </div>
            </div>

            <a
              className="profile-visit-btn leetcode-btn"
              href={leetcode.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${leetcode.username} on LeetCode (opens in new tab)`}
            >
              <span>View Profile</span>
              <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="profile-stats-panel">
            <div className="profile-metric-main">
              <div className="metric-figure">
                <span className="figure-val">{leetcode.totalSolved}</span>
                <span className="figure-sub">Problems Solved</span>
              </div>
              <div className="metric-badge">
                <Trophy size={13} /> Global Rank #{leetcode.ranking.toLocaleString()}
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="lc-bar-track" title={`Easy: ${leetcode.easySolved}, Medium: ${leetcode.mediumSolved}, Hard: ${leetcode.hardSolved}`}>
              <div className="lc-bar-segment lc-easy" style={{ width: `${easyPct}%` }} />
              <div className="lc-bar-segment lc-med" style={{ width: `${medPct}%` }} />
              <div className="lc-bar-segment lc-hard" style={{ width: `${hardPct}%` }} />
            </div>

            {/* Difficulty Breakdown Chips */}
            <div className="lc-difficulty-row">
              <div className="lc-diff-pill pill-easy">
                <span className="diff-label">Easy</span>
                <span className="diff-count">{leetcode.easySolved}</span>
              </div>
              <div className="lc-diff-pill pill-med">
                <span className="diff-label">Medium</span>
                <span className="diff-count">{leetcode.mediumSolved}</span>
              </div>
              <div className="lc-diff-pill pill-hard">
                <span className="diff-label">Hard</span>
                <span className="diff-count">{leetcode.hardSolved}</span>
              </div>
            </div>
          </div>

          <div className="profile-card-footer">
            <span className="profile-footer-tag">
              <Code2 size={13} /> Active Repository: <strong>leetcode-solutions (C++)</strong>
            </span>
          </div>
        </motion.article>

        {/* Card 2: HackerRank */}
        <motion.article
          className="glass coding-profile-card profile-hackerrank"
          {...reveal}
          transition={{ duration: 0.42, delay: 0.12 }}
        >
          <div className="profile-card-top">
            <div className="profile-platform-identity">
              <div className="platform-logo-tile hackerrank-tile">
                <HackerRankIcon size={28} />
              </div>
              <div>
                <span className="platform-tag hr-tag">DOMAIN PROFICIENCY</span>
                <h3>HackerRank</h3>
                <span className="profile-username">@{hackerrank.username} · {hackerrank.name}</span>
              </div>
            </div>

            <a
              className="profile-visit-btn hackerrank-btn"
              href={hackerrank.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${hackerrank.username} on HackerRank (opens in new tab)`}
            >
              <span>View Profile</span>
              <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="profile-stats-panel">
            <div className="profile-metric-main">
              <div className="metric-figure">
                <span className="figure-val hr-color">Level {hackerrank.level}</span>
                <span className="figure-sub">{hackerrank.country} · Verified Coder</span>
              </div>
              <div className="metric-badge hr-badge">
                <CheckCircle2 size={13} /> Verified Skills Portfolio
              </div>
            </div>

            {/* Verified Domain Badges */}
            <div className="hr-badges-row">
              {hackerrank.badges.map(badge => (
                <div key={badge.name} className="hr-badge-item">
                  <div className="hr-badge-top">
                    <span className="hr-badge-name">{badge.name}</span>
                    <div className="hr-stars-wrap">
                      {Array.from({ length: badge.stars }).map((_, i) => (
                        <Star key={i} size={11} fill="#00EA64" stroke="#00EA64" />
                      ))}
                    </div>
                  </div>
                  <div className="hr-badge-meta">
                    <span>{badge.solved} Solved</span>
                    {badge.points && <span>· {badge.points} Pts</span>}
                    {badge.rank && <span className="hr-rank">· Rank #{badge.rank.toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-card-footer">
            <span className="profile-footer-tag">
              <Terminal size={13} /> Domains: <strong>C++ (3★), SQL (1★), Python</strong>
            </span>
          </div>
        </motion.article>
      </div>
    </section>
  )
})

// Combined Technical Profile Page
export function TechnicalProfilePage() {
  return (
    <div className="container interior technical-profile-page">
      <header className="page-heading">
        <div className="eyebrow"><span className="line" /> Technical Profile</div>
        <h1>Skills & Coding Profiles</h1>
        <p>A comprehensive overview of Aman Kumar’s verified technical capabilities, development stack, and competitive programming track record.</p>
      </header>

      {/* 1. Skills Section */}
      <SkillsSection />

      {/* Divider */}
      <div className="section-spacer" />

      {/* 2. Coding Profiles Section */}
      <CodingProfilesSection />
    </div>
  )
}
