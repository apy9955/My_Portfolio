import { useEffect, useRef, useState, memo } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  decay: number
}

const SPARK_COLORS = ['#00f0ff', '#38bdf8', '#c0a2ff', '#ffffff', '#818cf8']

/**
 * Left-to-Right Futuristic Cinematic Energy Wave Reveal Transition
 * Sweeps a glowing neon cyan & violet energy beam across the viewport from left to right
 * with horizontal particle trails and zero scaling/zooming.
 */
export const CinematicRevealTransition = memo(function CinematicRevealTransition() {
  const location = useLocation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [active, setActive] = useState(false)
  const isFirstMount = useRef(true)
  const prevPath = useRef(location.pathname)
  const animFrameId = useRef<number | null>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    // Skip animation on initial page load / refresh
    if (isFirstMount.current) {
      isFirstMount.current = false
      prevPath.current = location.pathname
      return
    }

    // Trigger only on actual pathname changes
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname

      if (prefersReducedMotion) return

      setActive(true)
      const timer = setTimeout(() => {
        setActive(false)
      }, 820)

      return () => clearTimeout(timer)
    }
  }, [location.pathname, prefersReducedMotion])

  // Canvas particle trail animation
  useEffect(() => {
    if (!active || prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const sparks: Spark[] = []
    const startTime = performance.now()
    const duration = 820

    function render(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Horizontal position of the energy wave: Left (-10%) to Right (110%)
      const waveX = (progress * 1.2 - 0.1) * width

      ctx!.clearRect(0, 0, width, height)

      // Spawn new particles along the energy beam if still on-screen
      if (progress < 0.85 && waveX >= 0 && waveX <= width + 50) {
        const spawnCount = Math.floor(Math.random() * 4) + 2
        for (let i = 0; i < spawnCount; i++) {
          sparks.push({
            x: waveX + (Math.random() - 0.5) * 20,
            y: Math.random() * height,
            vx: -(Math.random() * 4 + 1.5), // drift backwards to the left
            vy: (Math.random() - 0.5) * 1.8,
            size: Math.random() * 2.2 + 0.8,
            color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
            alpha: 1,
            decay: Math.random() * 0.045 + 0.025,
          })
        }
      }

      // Update and draw spark trails
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.alpha -= s.decay

        if (s.alpha <= 0) {
          sparks.splice(i, 1)
          continue
        }

        ctx!.save()
        ctx!.globalAlpha = s.alpha
        ctx!.fillStyle = s.color
        ctx!.shadowColor = s.color
        ctx!.shadowBlur = 8
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }

      if (progress < 1 || sparks.length > 0) {
        animFrameId.current = requestAnimationFrame(render)
      }
    }

    animFrameId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current)
    }
  }, [active, prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <div className={`horizontal-reveal-overlay ${active ? 'is-active' : ''}`} aria-hidden="true">
      {/* 1. Canvas Particle Spark Trail */}
      <canvas ref={canvasRef} className="reveal-sparks-canvas" />

      {/* 2. Sweeping Energy Wave Blade and Curtain */}
      <AnimatePresence>
        {active && (
          <div className="reveal-wave-track">
            {/* Trailing Curtain Mask */}
            <motion.div
              className="reveal-curtain-wash"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.82, ease: [0.25, 1, 0.4, 1] }}
            />

            {/* Leading Glowing Energy Blade */}
            <motion.div
              className="reveal-energy-blade"
              initial={{ left: '-12%' }}
              animate={{ left: '112%' }}
              transition={{ duration: 0.82, ease: [0.25, 1, 0.4, 1] }}
            >
              <div className="blade-core" />
              <div className="blade-halo" />
              <div className="blade-flare" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
})

// Export alias for seamless backward compatibility
export const HyperspacePortal = CinematicRevealTransition
