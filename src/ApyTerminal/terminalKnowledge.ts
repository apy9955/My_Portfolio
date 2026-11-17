/**
 * APY Terminal Knowledge Base & Natural Language Processor
 * Grounded in verified portfolio content, dual-degree academic records,
 * GitHub snapshots, and competitive coding profiles of Aman Kumar.
 */

export interface TerminalLine {
  type: 'prompt' | 'info' | 'success' | 'warning' | 'error' | 'system' | 'header' | 'link'
  text: string
  link?: { url: string; label: string }
}

export interface TerminalResponse {
  lines: TerminalLine[]
  suggestedNext?: string[]
}

// Built-in Terminal Commands
export const SYSTEM_COMMANDS: Record<string, (query?: string) => TerminalResponse> = {
  help: () => ({
    lines: [
      { type: 'header', text: '╔══════════════════════════════════════════════════════════════════╗' },
      { type: 'header', text: '║                 APY TERMINAL — SYSTEM COMMANDS                   ║' },
      { type: 'header', text: '║   [Engine: Verified Portfolio Knowledge Graph & Rule-Based NLP]  ║' },
      { type: 'header', text: '╚══════════════════════════════════════════════════════════════════╝' },
      { type: 'info', text: 'CORE COMMANDS:' },
      { type: 'system', text: '  whoami       - Display identity, pronouns, bio & location' },
      { type: 'system', text: '  about        - Comprehensive background, journey & philosophy' },
      { type: 'system', text: '  education    - Dual-degree: B.Tech Engineering & B.Sc. Physics' },
      { type: 'system', text: '  projects     - View featured projects & software platforms' },
      { type: 'system', text: '  skills       - Inspect verified languages, frontend, backend & tools' },
      { type: 'system', text: '  github       - Live GitHub statistics, repositories & activity' },
      { type: 'system', text: '  leetcode     - Competitive programming stats & DSA problem records' },
      { type: 'system', text: '  hackerrank   - Verified domain badges (C++, SQL, Python) & level' },
      { type: 'system', text: '  interests    - Research frontiers & systems computing interests' },
      { type: 'system', text: '  goals        - The Road Ahead & long-term research ambitions' },
      { type: 'system', text: '  universe     - Launch Interactive Knowledge Galaxy constellation' },
      { type: 'system', text: '  contact      - Direct email, LinkedIn & communication channels' },
      { type: 'system', text: '  sudo explore - Execute deep cosmological diagnostic scan' },
      { type: 'system', text: '  clear        - Reset and clear the terminal output buffer' },
      { type: 'info', text: '' },
      { type: 'info', text: '[TIP] You can also ask any natural-language question directly, e.g.:' },
      { type: 'info', text: '      "Tell me about Byte Forge", "Does he use Linux?", "What are his degrees?"' },
    ],
    suggestedNext: ['whoami', 'education', 'projects', 'skills'],
  }),

  whoami: () => ({
    lines: [
      { type: 'header', text: '>>> IDENTITY: AMAN KUMAR' },
      { type: 'info', text: '  Username:   @apy9955 (GitHub & LeetCode) | @1823ary (HackerRank)' },
      { type: 'info', text: '  Pronouns:   He / Him' },
      { type: 'info', text: '  Location:   Solan, Himachal Pradesh, India 🌍' },
      { type: 'info', text: '  Role:       Developer · Space & Computing Enthusiast · Researcher' },
      { type: 'system', text: '  Tagline:    "Exploring physics, engineering, and deep-tech systems."' },
      { type: 'success', text: '  Status:     Dual-Degree Student: B.Tech (3rd Sem) + B.Sc. Physics (7th Sem)' },
    ],
    suggestedNext: ['education', 'skills', 'projects', 'contact'],
  }),

  about: () => ({
    lines: [
      { type: 'header', text: '>>> PROFILE: ENGINEERING, PHYSICS & RESEARCH' },
      { type: 'info', text: 'Aman Kumar is bridging the gap between computational systems and fundamental physics.' },
      { type: 'system', text: 'Currently pursuing two concurrent academic degrees:' },
      { type: 'info', text: '  • B.Tech (Engineering) — 3rd Semester: Hardware systems, digital logic, DSA in C/C++.' },
      { type: 'info', text: '  • B.Sc. (Physics) — 7th Semester: Quantum mechanics, electrodynamics, cosmology & astrophysics.' },
      { type: 'success', text: 'Philosophy: Rigorous mathematical foundations meeting high-performance computing.' },
    ],
    suggestedNext: ['education', 'goals', 'projects'],
  }),

  education: () => ({
    lines: [
      { type: 'header', text: '>>> ACADEMIC BACKGROUND — DUAL DEGREE PATHWAY' },
      { type: 'info', text: '1. B.Tech in Engineering (3rd Semester · Active)' },
      { type: 'system', text: '   • Focus: Electronic systems, logic design, digital architecture, low-level programming.' },
      { type: 'system', text: '   • Core Subjects: Circuit Theory, Digital Logic, Data Structures & Algorithms, Systems Engineering.' },
      { type: 'system', text: '   • Applied Skills: C/C++, hardware abstraction, embedded logic, performance optimization.' },
      { type: 'info', text: '' },
      { type: 'info', text: '2. B.Sc. in Physics (7th Semester · Advanced)' },
      { type: 'system', text: '   • Focus: Theoretical physics, mathematical modeling, cosmological structures.' },
      { type: 'system', text: '   • Core Subjects: Quantum Mechanics, Classical Electrodynamics, Thermodynamics, Astrophysics.' },
      { type: 'system', text: '   • Applied Skills: Differential equations, numerical simulations, tensor calculus, field equations.' },
      { type: 'success', text: '[INFO] Both degrees are actively being pursued with dedicated coursework and project implementations.' },
    ],
    suggestedNext: ['goals', 'skills', 'projects'],
  }),

  projects: () => ({
    lines: [
      { type: 'header', text: '>>> PORTFOLIO HIGHLIGHTS & SOFTWARE PLATFORMS' },
      { type: 'info', text: '1. Byte Forge (Competitive C Programming Engine)' },
      { type: 'system', text: '   • High-concurrency competition platform supporting 60+ live student contestants.' },
      { type: 'system', text: '   • Automated C code evaluation engine, MCQ assessment & real-time socket leaderboard.' },
      { type: 'info', text: '2. MarkHECX (AI Creator Identity & Portfolio Platform)' },
      { type: 'system', text: '   • AI-assisted digital identity builder for modern creators and technical portfolios.' },
      { type: 'info', text: '3. Student Community Platform' },
      { type: 'system', text: '   • Campus engagement, discussion hubs, real-time collaboration tools for students.' },
      { type: 'info', text: '4. Agentic AI Engineering Lab (CampusBites)' },
      { type: 'system', text: '   • Autonomous multi-agent coordination system with tool execution and planning loops.' },
      { type: 'info', text: '5. Machine Learning Applications' },
      { type: 'system', text: '   • Hr-analytics-ml, Ecommerce-sales-dashboard, customer-segmentation-system, heart-disease-app, calories-burnt-app, delhi-house-price-predictor.' },
      { type: 'link', text: 'View full catalog on the Projects page: ', link: { url: '/projects', label: '/projects' } },
    ],
    suggestedNext: ['skills', 'github', 'leetcode'],
  }),

  skills: () => ({
    lines: [
      { type: 'header', text: '>>> TECHNICAL STACK & VERIFIED SKILLS' },
      { type: 'info', text: '• Programming Languages:  C, C++, Python, JavaScript (ES6+), HTML5, CSS3' },
      { type: 'info', text: '• Frontend Development:   React 19, Tailwind CSS v4, TypeScript, Framer Motion, Streamlit, Three.js' },
      { type: 'info', text: '• Backend & Databases:    Python REST APIs, SQL, MySQL, MariaDB, Pandas, NumPy, Scikit-Learn, XGBoost' },
      { type: 'info', text: '• Tools & Platforms:      Git, GitHub, Linux, Arch Linux, VS Code, Jupyter Notebook, Tableau, Looker Studio, Vite' },
      { type: 'success', text: '[INFO] All technologies are verified in active repositories and coursework.' },
    ],
    suggestedNext: ['projects', 'leetcode', 'hackerrank'],
  }),

  github: () => ({
    lines: [
      { type: 'header', text: '>>> GITHUB PROFILE (@apy9955)' },
      { type: 'info', text: '  Profile URL:     https://github.com/apy9955' },
      { type: 'info', text: '  Public Repos:    26 repositories' },
      { type: 'info', text: '  2026 Activity:   233 contributions across AI labs, C engines & ML dashboards' },
      { type: 'system', text: '  Key Repositories: agentic-ai-engineering-lab, leetcode-solutions, Hr-analytics-ml, Ecommerce-sales-dashboard' },
      { type: 'link', text: 'Visit GitHub: ', link: { url: 'https://github.com/apy9955', label: 'github.com/apy9955' } },
    ],
    suggestedNext: ['leetcode', 'hackerrank', 'projects'],
  }),

  leetcode: () => ({
    lines: [
      { type: 'header', text: '>>> LEETCODE PROFILE (@apy9955)' },
      { type: 'info', text: '  Profile URL:     https://leetcode.com/u/apy9955/' },
      { type: 'success', text: '  Total Solved:    36 verified algorithmic challenges' },
      { type: 'system', text: '  • Easy Solved:   12 problems' },
      { type: 'system', text: '  • Medium Solved: 21 problems' },
      { type: 'system', text: '  • Hard Solved:   3 problems' },
      { type: 'info', text: '  Global Ranking:  #3,429,344' },
      { type: 'info', text: '  Repository:      leetcode-solutions (C++ DSA implementations)' },
      { type: 'link', text: 'Visit LeetCode: ', link: { url: 'https://leetcode.com/u/apy9955/', label: 'leetcode.com/u/apy9955/' } },
    ],
    suggestedNext: ['hackerrank', 'github', 'skills'],
  }),

  hackerrank: () => ({
    lines: [
      { type: 'header', text: '>>> HACKERRANK PROFILE (@1823ary)' },
      { type: 'info', text: '  Handle:          1823ary (Aman Kumar · India)' },
      { type: 'info', text: '  Profile URL:     https://www.hackerrank.com/profile/1823ary' },
      { type: 'success', text: '  Coder Level:     Level 5' },
      { type: 'system', text: '  • C++ Domain:    3 Stars (★★★) | 9 challenges | 100 Pts | Rank #410,016' },
      { type: 'system', text: '  • SQL Domain:    1 Star (★)   | 11 challenges | 135 Pts' },
      { type: 'system', text: '  • Python:        Language Proficiency Badge' },
      { type: 'link', text: 'Visit HackerRank: ', link: { url: 'https://www.hackerrank.com/profile/1823ary', label: 'hackerrank.com/profile/1823ary' } },
    ],
    suggestedNext: ['leetcode', 'skills', 'contact'],
  }),

  interests: () => ({
    lines: [
      { type: 'header', text: '>>> RESEARCH & TECHNICAL INTERESTS' },
      { type: 'info', text: '1. Systems & Low-Level Computing: C, C++, memory models, Linux kernel, concurrency.' },
      { type: 'info', text: '2. Autonomous Agent Architectures: Multi-agent planning, tool-calling pipelines, RAG.' },
      { type: 'info', text: '3. Computational Physics & Cosmology: Numerical N-body gravity simulations, orbital dynamics, quantum mechanics.' },
      { type: 'info', text: '4. Interactive 3D Graphics: WebGL, Three.js, procedural atmospheric shaders.' },
    ],
    suggestedNext: ['goals', 'education', 'projects'],
  }),

  goals: () => ({
    lines: [
      { type: 'header', text: '>>> THE ROAD AHEAD — RESEARCH ROADMAP' },
      { type: 'info', text: '• Short-term: Deepen operating systems & distributed systems engineering while completing B.Tech coursework.' },
      { type: 'info', text: '• Medium-term: Integrate cosmological modeling with GPU-accelerated computing pipelines.' },
      { type: 'info', text: '• Long-term: Contribute to deep-tech systems, autonomous intelligent agent ecosystems, and scientific computational infrastructure.' },
    ],
    suggestedNext: ['education', 'projects', 'contact'],
  }),

  contact: () => ({
    lines: [
      { type: 'header', text: '>>> COMMUNICATION CHANNELS' },
      { type: 'info', text: '  Email:     1823ary@gmail.com' },
      { type: 'link', text: '  Draft Email: ', link: { url: 'mailto:1823ary@gmail.com', label: '1823ary@gmail.com' } },
      { type: 'link', text: '  LinkedIn:    ', link: { url: 'https://www.linkedin.com/in/apy9955', label: 'linkedin.com/in/apy9955' } },
      { type: 'link', text: '  GitHub:      ', link: { url: 'https://github.com/apy9955', label: 'github.com/apy9955' } },
      { type: 'info', text: '  Location:    Solan, Himachal Pradesh, India' },
    ],
    suggestedNext: ['whoami', 'projects'],
  }),

  'sudo explore': () => ({
    lines: [
      { type: 'header', text: '[SYSTEM ROOT ACCESS GRANTED] INITIATING DEEP COSMIC SCAN...' },
      { type: 'system', text: '  Target Coordinates: Solar System [Sun -> Mercury -> Venus -> Earth -> Mars -> Jupiter -> Saturn -> Uranus -> Neptune]' },
      { type: 'info', text: '  Rendering Engine: Three.js WebGL procedural shaders active.' },
      { type: 'info', text: '  Warp Tunnel: 180 perspective star streaks synchronized to scroll progress.' },
      { type: 'success', text: '  Status: Nominal. Scroll down to fly between celestial waypoints.' },
      { type: 'warning', text: '  Notice: "The cosmos is within us. We are made of star-stuff." — Carl Sagan' },
    ],
    suggestedNext: ['whoami', 'education', 'skills'],
  }),

  universe: () => ({
    lines: [
      { type: 'header', text: '>>> KNOWLEDGE GALAXY — INTERACTIVE MULTIVERSE' },
      { type: 'info', text: 'Welcome to Aman Kumar’s Interactive Knowledge Galaxy.' },
      { type: 'system', text: 'An interconnected constellation bridging 28 nodes and 44 bonds across:' },
      { type: 'system', text: '  • Gravitational Core (Aman Kumar)' },
      { type: 'system', text: '  • Dual Degree Education (B.Tech CSE & B.Sc. Physics)' },
      { type: 'system', text: '  • Programming & Low-Level Systems (C, C++, Linux Arch)' },
      { type: 'system', text: '  • AI & Autonomous Agentic Engineering' },
      { type: 'system', text: '  • Data Analytics & Real-Time Dashboards' },
      { type: 'system', text: '  • Theoretical Science & Computational Cosmology' },
      { type: 'system', text: '  • Engineering Projects (Byte Forge, MarkHECX, open-source models)' },
      { type: 'link', text: 'Launch Galaxy: ', link: { url: '/universe', label: '/universe' } },
    ],
    suggestedNext: ['projects', 'education', 'skills'],
  }),

  clear: () => ({
    lines: [],
  }),
}

// Intent Classification for Natural Language Questions
interface IntentMatcher {
  keywords: string[]
  handler: (query?: string) => TerminalResponse
}

const INTENT_MATCHERS: IntentMatcher[] = [
  {
    keywords: ['who', 'aman', 'name', 'author', 'developer', 'creator', 'him', 'location', 'live', 'where', 'city', 'state', 'solan', 'himachal'],
    handler: SYSTEM_COMMANDS.whoami,
  },
  {
    keywords: ['about', 'bio', 'background', 'intro', 'overview', 'summary', 'resume', 'cv', 'experience'],
    handler: SYSTEM_COMMANDS.about,
  },
  {
    keywords: ['education', 'degree', 'study', 'college', 'university', 'btech', 'b.tech', 'bsc', 'b.sc', 'semester', 'physics'],
    handler: (query?: string) => {
      const q = (query || '').toLowerCase()
      if (q.includes('btech') || q.includes('b.tech') || q.includes('engineering')) {
        return {
          lines: [
            { type: 'header', text: '>>> B.TECH ENGINEERING BACKGROUND (3RD SEMESTER)' },
            { type: 'info', text: 'Aman is in his 3rd semester studying engineering.' },
            { type: 'system', text: '• Coursework: Circuit Theory, Digital Logic Design, Data Structures & Algorithms, Systems Engineering.' },
            { type: 'system', text: '• Focus: High-performance low-level programming in C and C++, hardware-software interfaces, systems architecture.' },
          ],
          suggestedNext: ['education', 'skills', 'projects'],
        }
      }
      if (q.includes('physics') || q.includes('bsc') || q.includes('b.sc')) {
        return {
          lines: [
            { type: 'header', text: '>>> B.SC. PHYSICS BACKGROUND (7TH SEMESTER)' },
            { type: 'info', text: 'Aman is in his 7th semester studying Physics.' },
            { type: 'system', text: '• Coursework: Quantum Mechanics, Electrodynamics, Statistical Mechanics, Mathematical Physics, Astrophysics & Cosmology.' },
            { type: 'system', text: '• Focus: Mathematical modeling, differential equations, and cosmological simulations.' },
          ],
          suggestedNext: ['education', 'interests', 'goals'],
        }
      }
      return SYSTEM_COMMANDS.education()
    },
  },
  {
    keywords: ['project', 'built', 'app', 'portfolio', 'application', 'work'],
    handler: (query?: string) => {
      const q = (query || '').toLowerCase()
      if (q.includes('byte') || q.includes('forge') || q.includes('competition')) {
        return {
          lines: [
            { type: 'header', text: '>>> PROJECT DEEP-DIVE: BYTE FORGE' },
            { type: 'info', text: 'Byte Forge is a C programming competition platform built for 60 concurrent student participants.' },
            { type: 'system', text: '• Highlights: Multiple-choice & coding rounds, real-time automated code evaluation, live standings leaderboard.' },
            { type: 'system', text: '• Technology: C challenge evaluation engine, socket-driven scoring and student coordination.' },
            { type: 'link', text: 'View details: ', link: { url: '/projects/byte-forge', label: '/projects/byte-forge' } },
          ],
          suggestedNext: ['projects', 'skills'],
        }
      }
      if (q.includes('mark') || q.includes('hecx')) {
        return {
          lines: [
            { type: 'header', text: '>>> PROJECT DEEP-DIVE: MarkHECX' },
            { type: 'info', text: 'MarkHECX is an AI-powered creator identity and portfolio platform.' },
            { type: 'system', text: '• Highlights: Creator identity builder, portfolio presentation engine, AI assistance tools.' },
            { type: 'link', text: 'View details: ', link: { url: '/projects/markhecx', label: '/projects/markhecx' } },
          ],
          suggestedNext: ['projects', 'skills'],
        }
      }
      return SYSTEM_COMMANDS.projects()
    },
  },
  {
    keywords: ['byte', 'forge'],
    handler: () => ({
      lines: [
        { type: 'header', text: '>>> BYTE FORGE (C COMPETITION PLATFORM)' },
        { type: 'info', text: 'Byte Forge is a dedicated C coding competition system designed for 60 concurrent student contestants.' },
        { type: 'system', text: '• Features: Automated submission compiler & evaluator, dual MCQ + coding stages, real-time leaderboard.' },
        { type: 'link', text: 'View Project Details: ', link: { url: '/projects/byte-forge', label: '/projects/byte-forge' } },
      ],
      suggestedNext: ['projects', 'skills'],
    }),
  },
  {
    keywords: ['markhecx', 'mark'],
    handler: () => ({
      lines: [
        { type: 'header', text: '>>> MarkHECX (AI CREATOR IDENTITY PLATFORM)' },
        { type: 'info', text: 'MarkHECX unites creator identity, portfolio showcase, and AI assistance in one sleek interface.' },
        { type: 'link', text: 'View Project Details: ', link: { url: '/projects/markhecx', label: '/projects/markhecx' } },
      ],
      suggestedNext: ['projects', 'skills'],
    }),
  },
  {
    keywords: ['skill', 'language', 'stack', 'tech', 'framework', 'tool'],
    handler: SYSTEM_COMMANDS.skills,
  },
  {
    keywords: ['linux', 'arch', 'os', 'terminal', 'unix', 'bash', 'distro'],
    handler: () => ({
      lines: [
        { type: 'header', text: '>>> LINUX & SYSTEMS WORKFLOW' },
        { type: 'info', text: 'Yes! Aman actively uses Linux and Arch Linux for daily software development.' },
        { type: 'system', text: '• Environment: Arch Linux, Zsh/Bash scripting, Vim/VS Code, Git command line, GCC/Clang toolchains.' },
        { type: 'success', text: '• Comfort with Unix philosophy: modular tools, piped streams, shell scripting, process management.' },
      ],
      suggestedNext: ['skills', 'education', 'interests'],
    }),
  },
  {
    keywords: ['github', 'repo', 'git', 'commit', 'contribution'],
    handler: SYSTEM_COMMANDS.github,
  },
  {
    keywords: ['leetcode', 'dsa', 'problem', 'algorithm', 'coding profile'],
    handler: SYSTEM_COMMANDS.leetcode,
  },
  {
    keywords: ['hackerrank', 'badge', 'star'],
    handler: SYSTEM_COMMANDS.hackerrank,
  },
  {
    keywords: ['interest', 'passion', 'cosmology', 'astrophysics', 'space', 'research'],
    handler: SYSTEM_COMMANDS.interests,
  },
  {
    keywords: ['goal', 'future', 'roadmap', 'ambition', 'aim'],
    handler: SYSTEM_COMMANDS.goals,
  },
  {
    keywords: ['contact', 'email', 'reach', 'message', 'hire', 'touch', 'linkedin'],
    handler: SYSTEM_COMMANDS.contact,
  },
  {
    keywords: ['universe', 'galaxy', 'constellation', 'multiverse', 'stars', 'graph', 'visualization', 'map'],
    handler: SYSTEM_COMMANDS.universe,
  },
]

/**
 * Execute a command or natural language question against portfolio knowledge.
 */
export function processTerminalInput(input: string): TerminalResponse {
  const trimmed = input.trim()
  if (!trimmed) {
    return { lines: [] }
  }

  const clean = trimmed.toLowerCase()

  // 1. Direct Command Match
  if (clean in SYSTEM_COMMANDS) {
    return SYSTEM_COMMANDS[clean]()
  }

  // Handle standard UNIX aliases
  if (clean === 'ls') return SYSTEM_COMMANDS.projects()
  if (clean === 'date') return { lines: [{ type: 'info', text: new Date().toUTCString() }] }
  if (clean === 'uname' || clean === 'uname -a') {
    return { lines: [{ type: 'system', text: 'Linux apy-station 6.12.9-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux' }] }
  }

  // 2. Natural Language Intent Resolution
  const tokens = clean.split(/[\s,?.!]+/).filter(Boolean)
  let bestMatch: IntentMatcher | null = null
  let maxScore = 0

  for (const matcher of INTENT_MATCHERS) {
    let score = 0
    for (const kw of matcher.keywords) {
      if (clean.includes(kw)) score += 3
      if (tokens.includes(kw)) score += 2
    }
    if (score > maxScore) {
      maxScore = score
      bestMatch = matcher
    }
  }

  if (bestMatch && maxScore >= 2) {
    return bestMatch.handler(clean)
  }

  // 3. Fallback for Unrecognized Input
  return {
    lines: [
      { type: 'warning', text: `Command or topic not recognized: "${trimmed}"` },
      { type: 'info', text: 'Type "help" to view all available commands, or try asking:' },
      { type: 'system', text: '  • "Tell me about his education"' },
      { type: 'system', text: '  • "What projects has he built?"' },
      { type: 'system', text: '  • "Which programming languages does he know?"' },
      { type: 'system', text: '  • "How can I contact Aman?"' },
    ],
    suggestedNext: ['help', 'whoami', 'education', 'projects'],
  }
}
