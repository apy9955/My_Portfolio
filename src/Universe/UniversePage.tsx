import { useEffect } from 'react'
import KnowledgeGalaxy from './KnowledgeGalaxy'

export default function UniversePage() {
  useEffect(() => {
    document.title = 'Universe — Interactive Knowledge Galaxy · Aman Kumar'
  }, [])

  return (
    <div className="universe-page-shell">
      <KnowledgeGalaxy />
    </div>
  )
}
