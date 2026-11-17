import { githubProfile } from './github-profile'

export interface Project {
  slug: string
  title: string
  category: string
  description: string
  focus: string[]
  problem: string
  solution: string
  stack: string[]
  github?: string
  demo?: string
  screenshots: { src: string; alt: string }[]
  process?: string
  contributions?: string
}

export const projects: Project[] = [
  {
    slug: 'markhecx',
    title: 'MarkHECX',
    category: 'AI / Web Development',
    description: 'An AI-powered creator identity and portfolio platform.',
    focus: ['Creator identity', 'Portfolio building', 'AI assistance'],
    problem: 'Creators need a home for their work that communicates who they are and what they do.',
    solution: 'Bring creator identity and portfolio presentation together in an AI-powered platform.',
    stack: [],
    screenshots: [],
  },
  {
    slug: 'byte-forge',
    title: 'Byte Forge',
    category: 'EdTech / Competitive Programming',
    description: 'A C programming competition platform designed to support 60 concurrent students, featuring MCQ and coding challenges, automated evaluation, and live leaderboards.',
    focus: ['Multiple-choice challenges', 'C coding challenges', 'Automated evaluation', 'Live leaderboards'],
    problem: 'A live programming competition needs to deliver questions, evaluate submissions, and track standings as students compete.',
    solution: 'Combine multiple-choice and coding rounds with automated evaluation and live standings in a platform designed for 60 concurrent students.',
    stack: ['C (challenge language)'],
    screenshots: [],
  },
  {
    slug: 'student-community',
    title: 'Student Community Platform',
    category: 'Community / Web Development',
    description: 'A student-focused digital platform designed to improve communication, collaboration, and community engagement.',
    focus: ['Student communication', 'Collaboration', 'Community engagement'],
    problem: 'Students need a shared space to connect and collaborate around campus life.',
    solution: 'Create a student-focused digital platform built around communication, collaboration, and community participation.',
    stack: [],
    screenshots: [],
  },
]

export const about = {
  journey: '',
  approach: '',
  interests: '',
  goals: '',
}

export const skills = [
  {
    category: 'Programming Languages',
    items: ['C', 'C++', 'Python', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    category: 'Frontend Development',
    items: ['React', 'Tailwind CSS', 'Responsive Design', 'TypeScript', 'Framer Motion', 'Streamlit', 'Three.js'],
  },
  {
    category: 'Backend & Databases',
    items: ['Python Backend & APIs', 'SQL', 'MySQL / MariaDB', 'Scikit-Learn', 'Pandas & NumPy', 'ETL Pipelines'],
  },
  {
    category: 'Tools & Technologies',
    items: ['Git & GitHub', 'Linux', 'Arch Linux', 'VS Code', 'Jupyter Notebook', 'Tableau & Looker Studio', 'Vite'],
  },
]

export const contact = {
  email: githubProfile.email,
  github: githubProfile.url,
  linkedin: githubProfile.linkedin,
}
