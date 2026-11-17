export const githubProfile = {
  name: 'Aman Kumar',
  username: 'apy9955',
  url: 'https://github.com/apy9955',
  linkedin: 'https://www.linkedin.com/in/apy9955',
  email: '1823ary@gmail.com',
  location: 'Solan, Himachal Pradesh, India',
  pronouns: 'He/Him',
  tagline: 'Space & computing enthusiast | Exploring physics, engineering, and deep-tech systems. 🌍',
}

export const featuredNames = [
  'agentic-ai-engineering-lab',
  'Hr-analytics-ml',
  'Ecommerce-sales-dashboard',
  'customer-segmentation-system',
  'heart-disease-app',
  'calories-burnt-app',
  'delhi-house-price-predictor',
  'Sales-Prediction-ML',
  'Diabetes-Prediction-ML',
  'Sales-Revenue-Analysis-Dashboard',
]

export function repositoryPath(name: string) {
  return `/projects/github/${encodeURIComponent(name)}`
}
