import type { Repository } from './services/github'

export const repositoryCategories = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Python',
  'Web Development',
  'Data Analytics',
  'C / C++',
  'Other',
] as const

export type RepositoryCategory = typeof repositoryCategories[number]

export function categorize(repo: Repository): RepositoryCategory[] {
  const text = [repo.name, repo.description, ...(repo.topics ?? [])].join(' ').toLowerCase().replace(/[-_]+/g, ' ')
  const language = repo.language
  const labels: RepositoryCategory[] = []
  if (/\b(agentic|multi agent|artificial intelligence|ai|llm|langchain|rag)\b/.test(text)) labels.push('Artificial Intelligence')
  if (/\b(machine learning|ml|clustering|random forest|xgboost|predict(?:ion|ive|or)|regression)\b/.test(text)) labels.push('Machine Learning')
  if (language === 'Jupyter Notebook' || /\b(data science|pandas|scikit learn|numpy|ipynb)\b/.test(text)) labels.push('Data Science')
  if (language === 'Python' || /\bpython\b/.test(text)) labels.push('Python')
  if (['HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(language ?? '') || /\b(web app(?:lication)?|react|vite|streamlit|flask|django)\b/.test(text)) labels.push('Web Development')
  if (/\b(analysis|analytics|dashboard|reporting|tableau|looker|visualization|power bi)\b/.test(text)) labels.push('Data Analytics')
  if (language === 'C' || language === 'C++' || /\bc\+\+/.test(text)) labels.push('C / C++')
  return labels.length ? labels : ['Other']
}
