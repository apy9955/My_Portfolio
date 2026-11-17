import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Compass,
  Cpu,
  Database,
  Flame,
  GitFork,
  Github,
  Globe2,
  GraduationCap,
  Layers,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Milestone,
  Orbit,
  Rocket,
  Sparkles,
  Star,
  Telescope,
  Terminal,
  Trophy,
  Zap,
} from 'lucide-react'
import {
  ACADEMIC_DEGREES,
  RESEARCH_ROADMAP,
  RESEARCH_AREAS,
  type AcademicDegree,
} from './academic-data'
import { githubProfile } from './github-profile'
import { GitHubProfileStats } from './GitHubPortfolio'

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.42 },
}

const ROADMAP_ICONS: Record<string, typeof Layers> = {
  Layers,
  GraduationCap,
  Telescope,
  Rocket,
}

const INTEREST_ICONS: Record<string, typeof Atom> = {
  Atom,
  Orbit,
  Bot,
  Cpu,
  Zap,
  Compass,
}

/* =========================================================================
   1. Degree Card: B.Tech Engineering vs B.Sc. Physics
   ========================================================================= */
function DegreeCard({ degree }: { degree: AcademicDegree }) {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'journey' | 'competencies'>('curriculum')
  const isEngineering = degree.id === 'btech'

  const progressPercent = Math.round((degree.currentSemester / degree.totalSemesters) * 100)

  return (
    <motion.article
      {...reveal}
      className={`glass rounded-3xl p-6 sm:p-8 relative overflow-hidden border ${
        isEngineering
          ? 'border-cyan-500/35 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-cyan-950/25'
          : 'border-purple-500/35 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-purple-950/25'
      }`}
    >
      {/* Visual Ambient Glow */}
      <div
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: degree.visualTheme.accentColor }}
      />

      {/* Decorative Technical / Cosmological Watermark */}
      <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
        {isEngineering ? <Cpu size={140} strokeWidth={1} /> : <Orbit size={140} strokeWidth={1} />}
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center border font-mono font-bold text-xs"
              style={{
                backgroundColor: degree.visualTheme.badgeBg,
                borderColor: degree.visualTheme.borderColor,
                color: degree.visualTheme.accentColor,
              }}
            >
              {isEngineering ? <Terminal size={17} /> : <Atom size={17} />}
            </span>
            <div>
              <span
                className="text-xs font-mono uppercase tracking-wider block"
                style={{ color: degree.visualTheme.accentColor }}
              >
                {degree.field}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{degree.degreeTitle}</h3>
            </div>
          </div>

          <div
            className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border flex items-center gap-2 shadow-sm"
            style={{
              backgroundColor: degree.visualTheme.badgeBg,
              borderColor: degree.visualTheme.borderColor,
              color: degree.visualTheme.accentColor,
            }}
          >
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: degree.visualTheme.accentColor }} />
            <span>{degree.statusBadge}</span>
          </div>
        </div>

        {/* Institution / Curriculum Status Note (Editable, non-fabricated) */}
        <p className="text-xs font-mono text-gray-400 bg-slate-950/70 p-2.5 rounded-lg border border-white/5">
          <span className="text-gray-300 font-semibold">Program Track:</span> {degree.institutionNote}
        </p>

        {/* Degree Summary */}
        <p className="text-sm text-gray-300 leading-relaxed font-light">{degree.summary}</p>

        {/* Semester Journey Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Semester Progress</span>
            <span className="font-bold text-white">
              Sem {degree.currentSemester} of {degree.totalSemesters} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: degree.visualTheme.accentColor,
                boxShadow: `0 0 10px ${degree.visualTheme.accentColor}`,
              }}
            />
          </div>
        </div>

        {/* Interactive Tabs: Coursework vs Journey vs Competencies */}
        <div className="flex gap-2 pt-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'curriculum'
                ? 'bg-white/10 text-white font-bold border border-white/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Subjects &amp; Coursework
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'journey'
                ? 'bg-white/10 text-white font-bold border border-white/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Semester Stepper
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('competencies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'competencies'
                ? 'bg-white/10 text-white font-bold border border-white/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Core Competencies
          </button>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === 'curriculum' && (
            <motion.div
              key="curriculum"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {degree.curriculum.map(course => (
                <div key={course.title} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{course.title}</span>
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: degree.visualTheme.badgeBg,
                        color: degree.visualTheme.accentColor,
                      }}
                    >
                      {course.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed">{course.focus}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1"
            >
              {degree.semesterJourney.map(step => {
                const isCurrent = step.status === 'current'
                const isCompleted = step.status === 'completed'
                return (
                  <div
                    key={step.sem}
                    className={`p-2.5 rounded-lg text-xs font-mono flex items-start gap-2.5 border transition-all ${
                      isCurrent
                        ? 'bg-slate-900 border-cyan-400/60 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-slate-950/60 border-white/5 text-gray-300'
                        : 'bg-slate-950/30 border-white/5 text-gray-500 opacity-60'
                    }`}
                  >
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-900 text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    <div className="flex-1">
                      <span className="font-semibold">{step.description}</span>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'competencies' && (
            <motion.div
              key="competencies"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2"
            >
              {degree.competencies.map(comp => (
                <div key={comp} className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle2 size={15} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>{comp}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Academic Highlights */}
        <div className="pt-3 border-t border-white/10 space-y-1.5">
          <span className="text-[11px] font-mono text-gray-400 block uppercase tracking-wider">Documented Academic Highlights</span>
          {degree.academicHighlights.map((hl, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{hl}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

/* =========================================================================
   2. Synthesis Comparison: Engineering vs Physics
   ========================================================================= */
function DualDegreeSynthesis() {
  return (
    <motion.section {...reveal} className="glass p-6 sm:p-8 rounded-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Compass size={14} />
            <span>Interdisciplinary Synergy</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Engineering Rigor × Scientific Inquiry
          </h3>
        </div>
        <div className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 w-fit">
          Concurrent Dual Degree Track
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Code2 size={16} />
          </div>
          <h4 className="text-base font-bold text-white">Engineering (B.Tech)</h4>
          <p className="text-xs font-mono text-cyan-300">How to Build Systems</p>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Focuses on constructing robust architectures, deterministic execution, low-latency concurrent processing, and scalable user interfaces.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/70 border border-purple-500/20 space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Atom size={16} />
          </div>
          <h4 className="text-base font-bold text-white">Physics (B.Sc.)</h4>
          <p className="text-xs font-mono text-purple-300">How Nature Operates</p>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Investigates mathematical symmetries, fundamental forces, quantum phenomena, and gravitational spacetime geometry.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <h4 className="text-base font-bold text-white">The Interdisciplinary Bridge</h4>
          <p className="text-xs font-mono text-amber-300">Computational Astrophysics &amp; AI</p>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Translates theoretical physical principles into high-performance simulation software, 3D WebGL environments, and autonomous algorithms.
          </p>
        </div>
      </div>
    </motion.section>
  )
}

/* =========================================================================
   3. The Road Ahead — From Engineering to Research
   ========================================================================= */
function ResearchRoadmapSection() {
  const [selectedStage, setSelectedStage] = useState<number>(0)

  return (
    <motion.section {...reveal} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <Milestone size={14} />
            <span>Academic Vision &amp; Long-Term Ambitions</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            The Road Ahead — <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400 bg-clip-text text-transparent glow-text">From Engineering to Research</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 font-light max-w-2xl">
            Aspirational trajectory mapping the path from dual undergraduate foundations through Master’s and Doctoral research toward frontier scientific inquiry.
          </p>
        </div>

        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 w-fit">
          Aspirational Roadmap
        </span>
      </div>

      {/* 4-Stage Horizontal / Grid Progression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RESEARCH_ROADMAP.map((stage, idx) => {
          const Icon = ROADMAP_ICONS[stage.icon] || Layers
          const isSelected = selectedStage === idx

          return (
            <div
              key={stage.stage}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedStage(idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedStage(idx) }}
              className={`glass p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-4 text-left ${
                isSelected
                  ? 'border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-500/15'
                  : 'border-white/10 hover:border-white/20 bg-slate-950/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center border font-mono text-xs"
                    style={{ backgroundColor: `${stage.color}15`, borderColor: `${stage.color}40`, color: stage.color }}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-gray-300 border border-white/5">
                    {stage.stage}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">{stage.timeframe}</span>
                <h4 className="text-base font-bold text-white mt-0.5">{stage.title}</h4>
                <p className="text-xs text-gray-300 mt-2 font-light leading-relaxed">{stage.summary}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">{stage.badge}</span>
                <ChevronRight size={13} className={isSelected ? 'text-cyan-400' : 'text-gray-600'} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Milestone Inspector */}
      <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4 bg-slate-950/80">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-xs font-bold">
              {RESEARCH_ROADMAP[selectedStage].stage}:
            </span>
            <h4 className="text-lg font-bold text-white">
              {RESEARCH_ROADMAP[selectedStage].title} Focus Areas
            </h4>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {RESEARCH_ROADMAP[selectedStage].timeframe}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {RESEARCH_ROADMAP[selectedStage].deliverables.map((del, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">Objective 0{i + 1}</span>
              <p className="text-xs text-gray-300 leading-relaxed font-light">{del}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

/* =========================================================================
   4. Research Interests (6 Areas)
   ========================================================================= */
function ResearchInterestsSection() {
  return (
    <motion.section {...reveal} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Domains of Inquiry</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Research Interests</h3>
        </div>
        <span className="text-xs font-mono text-gray-400">6 Scientific &amp; Deep-Tech Pillars</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RESEARCH_AREAS.map(area => {
          const Icon = INTEREST_ICONS[area.icon] || Atom

          return (
            <div
              key={area.id}
              className="glass p-5 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${area.color}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{area.category}</span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {area.title}
                </h4>
                <p className="text-xs text-gray-300 mt-2 font-light leading-relaxed">{area.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                {area.keywords.map(kw => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-gray-300 border border-white/5"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}

/* =========================================================================
   5. Main Academic Profile Component
   ========================================================================= */
export default function AcademicProfile() {
  return (
    <div className="space-y-16">
      {/* 1. Personal Identity & Academic Orientation Header */}
      <motion.section
        {...reveal}
        className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-cyan-950/25 border border-cyan-500/30"
      >
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-xs border border-cyan-500/30 flex items-center gap-1.5">
              <Cpu size={13} />
              <span>B.Tech Engineering (Sem 3)</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 font-mono text-xs border border-purple-500/30 flex items-center gap-1.5">
              <Atom size={13} />
              <span>B.Sc. Physics (Sem 7)</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-gray-300 font-mono text-xs flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-400" />
              <span>{githubProfile.location}</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Aman <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400 bg-clip-text text-transparent glow-text">Kumar</span>
            </h1>
            <p className="text-sm sm:text-base text-cyan-300 font-mono mt-2 flex items-center gap-2">
              <span>{githubProfile.pronouns}</span>
              <span className="text-gray-500">•</span>
              <span>@{githubProfile.username}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300 font-sans font-light">Dual Academic Scholar &amp; Systems Developer</span>
            </p>
          </div>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light max-w-3xl">
            {githubProfile.tagline}
          </p>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light max-w-3xl border-l-2 border-cyan-400 pl-4">
            At the confluence of empirical engineering and theoretical physics, I study both how we construct advanced digital systems and how the universe fundamentally operates. Currently pursuing a dual academic path—combining undergraduate Engineering (3rd Semester) with a simultaneous Bachelor of Science in Physics (7th Semester)—with an overarching ambition to advance into graduate research (MS &amp; PhD) at the frontiers of computing, space science, and deep technology.
          </p>

          {/* Social / Contact Links */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            <a
              href={githubProfile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gray-200 hover:text-white text-xs font-mono border border-white/10 flex items-center gap-2 transition-colors"
            >
              <Github size={15} />
              <span>GitHub (@{githubProfile.username})</span>
              <ArrowUpRight size={13} />
            </a>

            <a
              href={githubProfile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 text-xs font-mono border border-cyan-500/30 flex items-center gap-2 transition-colors"
            >
              <Linkedin size={15} />
              <span>LinkedIn</span>
              <ArrowUpRight size={13} />
            </a>

            <a
              href={`mailto:${githubProfile.email}`}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <Mail size={15} />
              <span>{githubProfile.email}</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* 2. Academic Background — Two Distinct Degree Experiences */}
      <section className="space-y-6" aria-labelledby="academic-background-title">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <GraduationCap size={15} />
              <span>Formal Educational Pursuits</span>
            </div>
            <h2 id="academic-background-title" className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Academic Background — Dual Degree Track
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-400">Engineering + Physics</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DegreeCard degree={ACADEMIC_DEGREES.btech} />
          <DegreeCard degree={ACADEMIC_DEGREES.bsc} />
        </div>
      </section>

      {/* 3. Synthesis: Engineering vs Physics */}
      <DualDegreeSynthesis />

      {/* 4. Research Roadmap: The Road Ahead */}
      <ResearchRoadmapSection />

      {/* 5. Research Interests (6 Pillars) */}
      <ResearchInterestsSection />

      {/* 6. GitHub Telemetry & Profile Integration */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Verified Repository Activity</span>
        </div>
        <GitHubProfileStats />
      </section>

      {/* 7. Bottom Navigation Link to Projects */}
      <motion.div {...reveal} className="glass p-8 rounded-2xl text-center space-y-4 border border-cyan-500/30">
        <h4 className="text-2xl font-bold text-white">Explore My Engineering Showcase</h4>
        <p className="text-sm text-gray-300 max-w-xl mx-auto font-light">
          Inspect MarkHECX, Byte Forge (60 concurrent users), the Student Community Platform, and 26 open-source GitHub repositories.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/projects"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <span>Explore All Projects</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
