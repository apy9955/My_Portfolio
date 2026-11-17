/**
 * Academic Background, Dual Degree Data & Research Roadmap
 * Aman Kumar Portfolio
 * 
 * Clean, structured and fully editable data objects.
 */

export interface DegreeCourse {
  title: string
  focus: string
  type: 'core' | 'math' | 'applied' | 'lab'
}

export interface DegreeJourneyStep {
  sem: number
  label: string
  status: 'completed' | 'current' | 'upcoming'
  description: string
}

export interface AcademicDegree {
  id: 'btech' | 'bsc'
  degreeTitle: string
  field: string
  shortTitle: string
  currentSemester: number
  totalSemesters: number
  statusBadge: string
  institutionNote: string // Clean editable field
  visualTheme: {
    accentColor: string
    borderColor: string
    glowColor: string
    badgeBg: string
    gradient: string
  }
  summary: string
  curriculum: DegreeCourse[]
  competencies: string[]
  semesterJourney: DegreeJourneyStep[]
  academicHighlights: string[]
}

export const ACADEMIC_DEGREES: Record<'btech' | 'bsc', AcademicDegree> = {
  btech: {
    id: 'btech',
    degreeTitle: 'Bachelor of Technology (B.Tech)',
    field: 'Engineering & Computing Systems',
    shortTitle: 'B.Tech — Engineering',
    currentSemester: 3,
    totalSemesters: 8,
    statusBadge: 'Current: 3rd Semester (Active)',
    institutionNote: 'Undergraduate Engineering Program (Details customizable in academic-data.ts)',
    visualTheme: {
      accentColor: '#00f0ff',
      borderColor: 'rgba(0, 240, 255, 0.35)',
      glowColor: 'rgba(0, 240, 255, 0.2)',
      badgeBg: 'rgba(0, 240, 255, 0.1)',
      gradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(23, 147, 209, 0.05))',
    },
    summary:
      'Rigorous engineering foundation centered on systems programming, algorithmic problem-solving, computer architecture, and low-latency software infrastructure.',
    curriculum: [
      { title: 'Programming & Data Structures', focus: 'C / C++, Pointer Arithmetic, Memory Management', type: 'core' },
      { title: 'Digital Logic & Computer Systems', focus: 'Microprocessor Architecture, Logic Design, Assembly Basics', type: 'core' },
      { title: 'Engineering Mathematics', focus: 'Linear Algebra, Multivariable Calculus, Discrete Math', type: 'math' },
      { title: 'Object-Oriented Design', focus: 'Software Modularity, Reusable Components, Clean Architecture', type: 'applied' },
      { title: 'Systems & Toolchain Labs', focus: 'GCC, Linux Toolchains, Shell Scripting, Git Versioning', type: 'lab' },
    ],
    competencies: [
      'Low-latency concurrent programming (Byte Forge platform)',
      'Systems debugging & memory profiling in C/C++',
      'Linux kernel tuning & daily Arch Linux/Hyprland environment',
      'Modular client architecture with React 19 & TypeScript',
    ],
    semesterJourney: [
      { sem: 1, label: 'Sem 1', status: 'completed', description: 'Core Engineering Mathematics, C Fundamentals & Scientific Foundations' },
      { sem: 2, label: 'Sem 2', status: 'completed', description: 'Data Structures, Object-Oriented Principles & Digital Logic Systems' },
      { sem: 3, label: 'Sem 3', status: 'current', description: 'Active: Computer Architecture, Algorithm Design & Systems Engineering' },
      { sem: 4, label: 'Sem 4', status: 'upcoming', description: 'Upcoming: Operating Systems, Database Management & Software Engineering' },
      { sem: 5, label: 'Sem 5', status: 'upcoming', description: 'Upcoming: Distributed Systems, Compiler Design & Network Protocols' },
      { sem: 6, label: 'Sem 6', status: 'upcoming', description: 'Upcoming: Advanced Computing Systems, Machine Learning Architectures' },
      { sem: 7, label: 'Sem 7', status: 'upcoming', description: 'Upcoming: Capstone Engineering Project Phase I & Electives' },
      { sem: 8, label: 'Sem 8', status: 'upcoming', description: 'Upcoming: Senior Capstone Deployment, Comprehensive Review' },
    ],
    academicHighlights: [
      'Engineered Byte Forge: Competition platform for 60 concurrent students with live automated C code evaluation',
      'Active developer in student coding initiatives and collaborative open-source technology projects',
      'HacXLerate 2026 Round 1 Technical Participation & Certificate',
    ],
  },

  bsc: {
    id: 'bsc',
    degreeTitle: 'Bachelor of Science (B.Sc.) in Physics',
    field: 'Physics, Theoretical Science & Natural Philosophy',
    shortTitle: 'B.Sc. — Physics',
    currentSemester: 7,
    totalSemesters: 8,
    statusBadge: 'Current: 7th Semester (Advanced Research Phase)',
    institutionNote: 'Bachelor of Science Program (Details customizable in academic-data.ts)',
    visualTheme: {
      accentColor: '#c0a2ff',
      borderColor: 'rgba(192, 162, 255, 0.35)',
      glowColor: 'rgba(192, 162, 255, 0.2)',
      badgeBg: 'rgba(192, 162, 255, 0.1)',
      gradient: 'linear-gradient(135deg, rgba(192, 162, 255, 0.14), rgba(240, 180, 41, 0.05))',
    },
    summary:
      'In-depth study of the fundamental laws governing matter, energy, spacetime, and the cosmos—from quantum mechanical observables to relativistic celestial dynamics.',
    curriculum: [
      { title: 'Classical & Analytical Mechanics', focus: 'Lagrangian & Hamiltonian Formulations, Central Force Motion', type: 'core' },
      { title: 'Quantum Mechanics', focus: 'Schrödinger Wave Equations, Eigenvalues, Hilbert Spaces', type: 'core' },
      { title: 'Electrodynamics & Optics', focus: 'Maxwell’s Equations, Wave Propagation, Electromagnetic Potentials', type: 'core' },
      { title: 'Mathematical Physics', focus: 'Differential Equations, Complex Analysis, Fourier Transforms', type: 'math' },
      { title: 'Astrophysics & Modern Physics', focus: 'Stellar Evolution, Special Relativity, Cosmological Models', type: 'applied' },
    ],
    competencies: [
      'First-principles theoretical modeling & mathematical derivations',
      'Computational astrophysics modeling & celestial WebGL simulations',
      'Rigorous scientific reasoning & analytical error minimization',
      'Bridging discrete computational logic with continuous physical laws',
    ],
    semesterJourney: [
      { sem: 1, label: 'Sem 1', status: 'completed', description: 'Mechanics, Vectors, Differential Calculus & Thermal Foundations' },
      { sem: 2, label: 'Sem 2', status: 'completed', description: 'Waves, Oscillations, Geometric Optics & Mathematical Methods' },
      { sem: 3, label: 'Sem 3', status: 'completed', description: 'Electricity, Magnetism, Electromagnetic Induction & Circuit Physics' },
      { sem: 4, label: 'Sem 4', status: 'completed', description: 'Thermodynamics, Kinetic Theory, Statistical Concepts & Modern Physics' },
      { sem: 5, label: 'Sem 5', status: 'completed', description: 'Quantum Mechanics Fundamentals, Solid State Physics & Atomic Spectroscopy' },
      { sem: 6, label: 'Sem 6', status: 'completed', description: 'Nuclear & Particle Physics, Electrodynamics & Computational Physics' },
      { sem: 7, label: 'Sem 7', status: 'current', description: 'Active: Advanced Quantum Dynamics, Relativity & Theoretical Cosmology' },
      { sem: 8, label: 'Sem 8', status: 'upcoming', description: 'Upcoming: Physics Research Seminar, Final Advanced Investigation' },
    ],
    academicHighlights: [
      'Advanced 7th-semester standing in theoretical physics with dual enrollment alongside engineering',
      'Applied scientific principles to create interactive 3D Three.js Solar System gravitational model',
      'Focused research trajectory combining theoretical physics with deep-tech computing systems',
    ],
  },
}

export const RESEARCH_ROADMAP = [
  {
    stage: 'Stage 01',
    title: 'Foundation',
    badge: 'Current Phase',
    timeframe: 'Undergraduate Dual Journey',
    color: '#00f0ff',
    icon: 'Layers',
    summary:
      'Strengthen deep understanding across engineering systems, theoretical physics, higher mathematics, C/C++ architecture, and empirical scientific computing principles.',
    deliverables: [
      'Complete B.Tech in Engineering (3rd sem active) & B.Sc. in Physics (7th sem active)',
      'Publish open-source engineering implementations & reproducible research prototypes',
      'Deepen mastery of classical/quantum mechanics and low-level computer systems',
    ],
  },
  {
    stage: 'Stage 02',
    title: 'Master’s Degree (MS)',
    badge: 'Target Horizon',
    timeframe: 'Graduate Research Specialization',
    color: '#38bdf8',
    icon: 'GraduationCap',
    summary:
      'Pursue advanced graduate studies through an MS program focused at the intersection of physics, computing systems, or interdisciplinary deep-tech research.',
    deliverables: [
      'Identify graduate programs specializing in computational physics, scientific computing, or AI systems',
      'Author peer-reviewed conference or journal papers with academic faculty mentorship',
      'Conduct rigorous research in simulation algorithms, high-performance computing, or cosmological modeling',
    ],
  },
  {
    stage: 'Stage 03',
    title: 'Doctoral Research (PhD)',
    badge: 'Long-Term Trajectory',
    timeframe: 'Doctoral Investigation',
    color: '#c0a2ff',
    icon: 'Telescope',
    summary:
      'Undertake PhD research to cultivate deep domain expertise, scientific independence, and foundational problem-solving in complex physical and computational systems.',
    deliverables: [
      'Formulate novel theoretical hypotheses and empirical benchmarks in physics or deep-tech computing',
      'Collaborate with international scientific laboratories, observatories, or computing research institutes',
      'Defend doctoral thesis contributing original knowledge to the scientific community',
    ],
  },
  {
    stage: 'Stage 04',
    title: 'Research & Innovation',
    badge: 'Ultimate Vision',
    timeframe: 'Frontier Scientific Leadership',
    color: '#f0b429',
    icon: 'Rocket',
    summary:
      'Lead and contribute to frontier investigations combining theoretical physics, space science, high-performance computing, and emergent technologies to solve fundamental challenges.',
    deliverables: [
      'Drive interdisciplinary breakthroughs in scientific computing, astrophysics, or artificial intelligence',
      'Bridge theoretical natural philosophy with deployable engineering innovations',
      'Mentor the next generation of engineers, physics scholars, and scientific researchers',
    ],
  },
]

export const RESEARCH_AREAS = [
  {
    id: 'physics',
    title: 'Physics & Theoretical Science',
    category: 'Theoretical Foundations',
    icon: 'Atom',
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    accent: '#c0a2ff',
    description:
      'Investigating Lagrangian mechanics, quantum operators, relativity, and the mathematical symmetries governing natural laws.',
    keywords: ['Quantum Mechanics', 'Hamiltonian Dynamics', 'Relativity', 'Mathematical Physics'],
  },
  {
    id: 'cosmology',
    title: 'Space Science & Cosmology',
    category: 'Astrophysical Dynamics',
    icon: 'Orbit',
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    accent: '#f0b429',
    description:
      'Exploring stellar evolution, gravitational physics, black hole mechanics, and celestial simulations using computational tools.',
    keywords: ['Stellar Evolution', 'Gravitational Dynamics', 'Black Holes', 'Celestial Mechanics'],
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    category: 'Autonomous Systems',
    icon: 'Bot',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    accent: '#00f0ff',
    description:
      'Architecting multi-agent reasoning labs, context-aware prompt orchestration, and intelligent creator tools (MarkHECX).',
    keywords: ['Multi-Agent AI', 'Agentic Workflows', 'Context Orchestration', 'Deep-Tech AI'],
  },
  {
    id: 'computing',
    title: 'Computing & Systems',
    category: 'Low-Latency Architecture',
    icon: 'Cpu',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    accent: '#10b981',
    description:
      'Engineering high-concurrency contest engines (Byte Forge), memory-safe C/C++ workflows, and Linux-based toolchains.',
    keywords: ['C / C++', 'Concurrency (60 Users)', 'Memory Management', 'Process Sandboxing'],
  },
  {
    id: 'deeptech',
    title: 'Engineering & Deep Tech',
    category: 'Applied Innovation',
    icon: 'Zap',
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    accent: '#3b82f6',
    description:
      'Bridging low-level systems with 3D WebGL graphics (Three.js Solar System), Arch Linux environments, and reactive architectures.',
    keywords: ['WebGL / Three.js', 'Arch Linux & Hyprland', 'Vite & React 19', 'Zsh Automation'],
  },
  {
    id: 'research',
    title: 'Scientific Research & Innovation',
    category: 'Empirical Discovery',
    icon: 'Compass',
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    accent: '#f43f5e',
    description:
      'Applying the scientific method, hypothesis verification, analytical rigor, and reproducible research workflows to technological problems.',
    keywords: ['Hypothesis Testing', 'First-Principles Thinking', 'Reproducibility', 'Interdisciplinary Models'],
  },
]
