import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { projects } from './src/data'
import { featuredNames, repositoryPath } from './src/github-profile'
import { apiApp } from './server/server'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'portfolio-backend-api',
      configureServer(server) {
        server.middlewares.use(apiApp)
      },
    },
    {
      name: 'portfolio-route-entry-points',
      apply: 'build',
      async closeBundle() {
        const html = await readFile('dist/index.html', 'utf8')
        const pages = [
          ['about', 'About'], ['projects', 'Projects'], ['skills', 'Skills'], ['contact', 'Contact'],
          ['universe', 'Universe'], ['explore', 'Explore'],
          ...projects.map(project => [`projects/${project.slug}`, project.title]),
          ...featuredNames.map(name => [repositoryPath(name).slice(1), name]),
        ]
        await Promise.all(pages.map(async ([route, title]) => {
          const directory = `dist/${route}`
          await mkdir(directory, { recursive: true })
          await writeFile(`${directory}/index.html`, html.replace(/<title>.*?<\/title>/, `<title>${title} · Aman Kumar</title>`))
        }))
        await writeFile('dist/404.html', html.replace(/<title>.*?<\/title>/, '<title>Page not found · Aman Kumar</title>'))
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three'
        },
      },
    },
  },
})
