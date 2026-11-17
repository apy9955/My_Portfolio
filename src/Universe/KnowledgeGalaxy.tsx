import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type MouseEvent,
  type TouchEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import {
  Search,
  X,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Atom,
  Orbit as OrbitIcon,
  Eye,
  Info,
} from 'lucide-react'
import {
  GALAXY_NODES_3D,
  GALAXY_LINKS_3D,
  CATEGORIES,
  type GalaxyNode3D,
  type ClusterCategory,
} from './galaxyData'

// -----------------------------------------------------------------------------
// Procedural Celestial Texture Generators (In-Memory Canvas)
// -----------------------------------------------------------------------------
function createStarCoreTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const center = size / 2
  const grad = ctx.createRadialGradient(center, center, 0, center, center, center)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
  grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)')
  grad.addColorStop(0.42, 'rgba(255, 255, 255, 0.45)')
  grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.1)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createStarHaloTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const center = size / 2
  const grad = ctx.createRadialGradient(center, center, 0, center, center, center)
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
  grad.addColorStop(0.22, 'rgba(255, 255, 255, 0.38)')
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)')
  grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.02)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createDiffractionFlareTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const center = size / 2

  // Horizontal Diffraction Spike
  const gradH = ctx.createLinearGradient(0, center, size, center)
  gradH.addColorStop(0, 'rgba(255, 255, 255, 0)')
  gradH.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)')
  gradH.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradH
  ctx.fillRect(0, center - 2, size, 4)

  // Vertical Diffraction Spike
  const gradV = ctx.createLinearGradient(center, 0, center, size)
  gradV.addColorStop(0, 'rgba(255, 255, 255, 0)')
  gradV.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)')
  gradV.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradV
  ctx.fillRect(center - 2, 0, 4, size)

  // Core Glare
  const gradC = ctx.createRadialGradient(center, center, 0, center, center, 45)
  gradC.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
  gradC.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)')
  gradC.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradC
  ctx.beginPath()
  ctx.arc(center, center, 45, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export default function KnowledgeGalaxy() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // UI State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('core-aman')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ClusterCategory | 'all'>('all')
  const [isDetailOpen, setIsDetailOpen] = useState(true)
  const [isAutoOrbit, setIsAutoOrbit] = useState(false)
  const [cameraDistance, setCameraDistance] = useState(380)

  // 3D Projected Screen Labels State
  const [projectedLabels, setProjectedLabels] = useState<
    Array<{ id: string; name: string; x: number; y: number; visible: boolean; isTarget: boolean; tier: number }>
  >([])

  // Node Map for fast lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, GalaxyNode3D>()
    for (const node of GALAXY_NODES_3D) map.set(node.id, node)
    return map
  }, [])

  // Selected Node Data
  const selectedNode = useMemo(
    () => (selectedNodeId ? nodeMap.get(selectedNodeId) || null : null),
    [selectedNodeId, nodeMap]
  )

  // Filtered nodes by search and category
  const filteredNodes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return GALAXY_NODES_3D.filter(node => {
      const matchesCategory = activeCategory === 'all' || node.category === activeCategory
      const matchesSearch =
        !q ||
        node.name.toLowerCase().includes(q) ||
        node.categoryLabel.toLowerCase().includes(q) ||
        node.relatedSkills.some(s => s.toLowerCase().includes(q)) ||
        node.connectedProjects.some(p => p.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, activeCategory])

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes])

  // Camera Control References
  const sphericalRef = useRef({
    radius: 380,
    theta: 0.45,
    phi: 1.15,
  })
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0))
  const isDraggingRef = useRef(false)
  const isRightDragRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const dragStartSphericalRef = useRef({ theta: 0, phi: 0, radius: 380 })
  const lastTouchDistRef = useRef<number | null>(null)

  // Cinematic Flight Animation Ref
  const flightAnimationRef = useRef<{
    active: boolean
    startTime: number
    duration: number
    startPos: THREE.Vector3
    targetPos: THREE.Vector3
    startLookAt: THREE.Vector3
    targetLookAt: THREE.Vector3
    startRadius: number
    targetRadius: number
  } | null>(null)

  // Fly Camera to Node
  const flyCameraToNode = useCallback(
    (nodeId: string) => {
      const node = nodeMap.get(nodeId)
      if (!node) return
      setSelectedNodeId(nodeId)
      setIsDetailOpen(true)

      const targetPos = new THREE.Vector3(node.x, node.y, node.z)
      const idealDistance = node.tier === 1 ? 210 : node.tier === 2 ? 150 : 120

      flightAnimationRef.current = {
        active: true,
        startTime: performance.now(),
        duration: 900,
        startPos: currentLookAtRef.current.clone(),
        targetPos: targetPos,
        startLookAt: currentLookAtRef.current.clone(),
        targetLookAt: targetPos,
        startRadius: sphericalRef.current.radius,
        targetRadius: idealDistance,
      }
    },
    [nodeMap]
  )

  // Reset 3D View
  const reset3DView = useCallback(() => {
    flightAnimationRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 800,
      startPos: currentLookAtRef.current.clone(),
      targetPos: new THREE.Vector3(0, 0, 0),
      startLookAt: currentLookAtRef.current.clone(),
      targetLookAt: new THREE.Vector3(0, 0, 0),
      startRadius: sphericalRef.current.radius,
      targetRadius: 380,
    }
  }, [])

  // Zoom By Factor
  const zoomBy = useCallback((factor: number) => {
    sphericalRef.current.radius = Math.max(110, Math.min(750, sphericalRef.current.radius * factor))
    setCameraDistance(Math.round(sphericalRef.current.radius))
  }, [])

  // ---------------------------------------------------------------------------
  // Three.js 3D WebGL Visualization Engine
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x02040a, 0.0009)

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 3000)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25

    // Textures
    const starCoreTex = createStarCoreTexture()
    const starHaloTex = createStarHaloTexture()
    const diffractionTex = createDiffractionFlareTexture()

    // 2. Multi-Layer Distant 3D Starfield
    const numDistantStars = 1400
    const starfieldGeo = new THREE.BufferGeometry()
    const starfieldPos = new Float32Array(numDistantStars * 3)
    const starfieldColors = new Float32Array(numDistantStars * 3)

    const spectralPalette = [
      new THREE.Color(0xa5c9ff), // Blue-White (hot O/B)
      new THREE.Color(0xffffff), // White (A/F)
      new THREE.Color(0xffdfac), // Yellow-Amber (G)
      new THREE.Color(0xffb799), // Orange-Red (K/M)
      new THREE.Color(0x73d5c9), // Cyan nebular
    ]

    for (let i = 0; i < numDistantStars; i++) {
      // Distribute in a celestial sphere
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 900 + Math.random() * 800

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      starfieldPos[i * 3] = x
      starfieldPos[i * 3 + 1] = y
      starfieldPos[i * 3 + 2] = z

      const color = spectralPalette[Math.floor(Math.random() * spectralPalette.length)]
      const brightness = 0.4 + Math.random() * 0.6
      starfieldColors[i * 3] = color.r * brightness
      starfieldColors[i * 3 + 1] = color.g * brightness
      starfieldColors[i * 3 + 2] = color.b * brightness
    }

    starfieldGeo.setAttribute('position', new THREE.BufferAttribute(starfieldPos, 3))
    starfieldGeo.setAttribute('color', new THREE.BufferAttribute(starfieldColors, 3))

    const starfieldMat = new THREE.PointsMaterial({
      size: 3.2,
      map: starCoreTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const starfieldPoints = new THREE.Points(starfieldGeo, starfieldMat)
    scene.add(starfieldPoints)

    // 3. Multi-Spectral Volumetric Gas Nebulae
    const nebulaData = [
      { pos: new THREE.Vector3(-150, 80, 40), color: 0x00f0ff, size: 280, opacity: 0.08 }, // Systems Cyan
      { pos: new THREE.Vector3(170, 90, -40), color: 0xa855f7, size: 300, opacity: 0.08 }, // AI Violet
      { pos: new THREE.Vector3(150, -110, 80), color: 0x14b8a6, size: 270, opacity: 0.07 }, // Data Teal
      { pos: new THREE.Vector3(-140, -80, 140), color: 0xf59e0b, size: 290, opacity: 0.08 }, // Science Gold
      { pos: new THREE.Vector3(90, 140, 120), color: 0xe11d48, size: 280, opacity: 0.07 }, // Education Ruby
    ]

    const nebulaeGroup = new THREE.Group()
    nebulaData.forEach(neb => {
      const nebGeo = new THREE.PlaneGeometry(neb.size, neb.size)
      const nebMat = new THREE.MeshBasicMaterial({
        map: starHaloTex,
        color: neb.color,
        transparent: true,
        opacity: neb.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(nebGeo, nebMat)
      mesh.position.copy(neb.pos)
      nebulaeGroup.add(mesh)
    })
    scene.add(nebulaeGroup)

    // 4. Constellation Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const linePoints: THREE.Vector3[] = []
    GALAXY_LINKS_3D.forEach(link => {
      const sNode = nodeMap.get(link.source)
      const tNode = nodeMap.get(link.target)
      if (sNode && tNode) {
        linePoints.push(new THREE.Vector3(sNode.x, sNode.y, sNode.z))
        linePoints.push(new THREE.Vector3(tNode.x, tNode.y, tNode.z))
      }
    })

    const linesGeo = new THREE.BufferGeometry().setFromPoints(linePoints)
    const linesMesh = new THREE.LineSegments(linesGeo, lineMat)
    scene.add(linesMesh)

    // 5. Constellation Photon Energy Pulses (Travelling Light Particles)
    const numPulses = 32
    const pulsesGeo = new THREE.BufferGeometry()
    const pulsePositions = new Float32Array(numPulses * 3)
    const pulseProgress = new Float32Array(numPulses)
    const pulseSpeeds = new Float32Array(numPulses)
    const pulseLinkIdx = new Int32Array(numPulses)

    for (let i = 0; i < numPulses; i++) {
      pulseLinkIdx[i] = Math.floor(Math.random() * GALAXY_LINKS_3D.length)
      pulseProgress[i] = Math.random()
      pulseSpeeds[i] = 0.003 + Math.random() * 0.004
    }

    pulsesGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3))
    const pulsesMat = new THREE.PointsMaterial({
      size: 5.5,
      map: starCoreTex,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const pulsesMesh = new THREE.Points(pulsesGeo, pulsesMat)
    scene.add(pulsesMesh)

    // 6. Primary Celestial Stars (Sprites & Halos)
    const starMeshesGroup = new THREE.Group()
    const starHitSpheres: Array<{ id: string; mesh: THREE.Mesh; node: GalaxyNode3D }> = []

    const hitGeo = new THREE.SphereGeometry(1, 8, 8)
    const hitMat = new THREE.MeshBasicMaterial({ visible: false })

    GALAXY_NODES_3D.forEach(node => {
      const nodePos = new THREE.Vector3(node.x, node.y, node.z)

      // A. Core Star Sprite
      const coreMat = new THREE.SpriteMaterial({
        map: starCoreTex,
        color: new THREE.Color(node.color),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.95,
      })
      const coreSprite = new THREE.Sprite(coreMat)
      const baseScale = node.size * (node.tier === 1 ? 1.6 : node.tier === 2 ? 1.2 : 0.9)
      coreSprite.scale.set(baseScale, baseScale, 1)
      coreSprite.position.copy(nodePos)
      starMeshesGroup.add(coreSprite)

      // B. Atmospheric Light Scattering Halo
      const haloMat = new THREE.SpriteMaterial({
        map: starHaloTex,
        color: new THREE.Color(node.glowColor),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: node.tier === 1 ? 0.75 : node.tier === 2 ? 0.5 : 0.35,
      })
      const haloSprite = new THREE.Sprite(haloMat)
      const haloScale = baseScale * (node.tier === 1 ? 3.8 : node.tier === 2 ? 2.8 : 2.2)
      haloSprite.scale.set(haloScale, haloScale, 1)
      haloSprite.position.copy(nodePos)
      starMeshesGroup.add(haloSprite)

      // C. Diffraction Spikes for Supergiants
      if (node.flare || node.tier === 1) {
        const flareMat = new THREE.SpriteMaterial({
          map: diffractionTex,
          color: new THREE.Color(node.color),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          opacity: 0.8,
        })
        const flareSprite = new THREE.Sprite(flareMat)
        const flareScale = baseScale * 4.5
        flareSprite.scale.set(flareScale, flareScale, 1)
        flareSprite.position.copy(nodePos)
        starMeshesGroup.add(flareSprite)
      }

      // D. Raycast Hit Sphere (Invisible, for pixel-perfect hover/click)
      const hitMesh = new THREE.Mesh(hitGeo, hitMat)
      hitMesh.position.copy(nodePos)
      hitMesh.scale.setScalar(Math.max(node.size * 0.9, 12))
      scene.add(hitMesh)
      starHitSpheres.push({ id: node.id, mesh: hitMesh, node })
    })

    scene.add(starMeshesGroup)

    // 7. Concentric Target Beacon for Selected Star
    const beaconRings = 3
    const beaconGroup = new THREE.Group()
    for (let r = 0; r < beaconRings; r++) {
      const ringGeo = new THREE.RingGeometry(16 + r * 6, 17 + r * 6, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.45 - r * 0.12,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      beaconGroup.add(ring)
    }
    scene.add(beaconGroup)

    // 8. Raycaster & Mouse State
    const raycaster = new THREE.Raycaster()
    const mouseNDC = new THREE.Vector2(-9999, -9999)

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // 9. Main Animation Loop
    let animationFrameId: number
    let clockTick = 0

    const animate = (timestamp: number) => {
      clockTick++

      // Smooth Flight Animation
      if (flightAnimationRef.current?.active) {
        const anim = flightAnimationRef.current
        const elapsed = timestamp - anim.startTime
        const progress = Math.min(1, elapsed / anim.duration)
        // Smoothstep interpolation
        const t = progress * progress * (3 - 2 * progress)

        currentLookAtRef.current.lerpVectors(anim.startLookAt, anim.targetLookAt, t)
        targetLookAtRef.current.copy(currentLookAtRef.current)
        sphericalRef.current.radius = THREE.MathUtils.lerp(anim.startRadius, anim.targetRadius, t)

        if (progress >= 1) {
          anim.active = false
        }
      }

      // Auto-Orbit Drift (if enabled and not dragging)
      if (isAutoOrbit && !isDraggingRef.current && !flightAnimationRef.current?.active) {
        sphericalRef.current.theta += 0.0012
      }

      // Gentle Harmonic Cosmic Float for stars (if not reduced motion)
      if (!prefersReducedMotion) {
        nebulaeGroup.rotation.y = clockTick * 0.0004
        nebulaeGroup.rotation.z = Math.sin(clockTick * 0.0003) * 0.05
        starfieldPoints.rotation.y = clockTick * 0.0001
      }

      // Update Photon Energy Pulses
      const pulsePosAttr = pulsesGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < numPulses; i++) {
        pulseProgress[i] += pulseSpeeds[i]
        if (pulseProgress[i] > 1) {
          pulseProgress[i] = 0
          pulseLinkIdx[i] = Math.floor(Math.random() * GALAXY_LINKS_3D.length)
        }

        const link = GALAXY_LINKS_3D[pulseLinkIdx[i]]
        if (link) {
          const sNode = nodeMap.get(link.source)
          const tNode = nodeMap.get(link.target)
          if (sNode && tNode) {
            const p = pulseProgress[i]
            pulsePosAttr.setXYZ(
              i,
              sNode.x + (tNode.x - sNode.x) * p,
              sNode.y + (tNode.y - sNode.y) * p,
              sNode.z + (tNode.z - sNode.z) * p
            )
          }
        }
      }
      pulsePosAttr.needsUpdate = true

      // Update Target Beacon Position & Orientation
      const selNode = selectedNodeId ? nodeMap.get(selectedNodeId) : null
      if (selNode) {
        beaconGroup.visible = true
        beaconGroup.position.set(selNode.x, selNode.y, selNode.z)
        beaconGroup.lookAt(camera.position)
        const pulse = 1.0 + Math.sin(clockTick * 0.06) * 0.08
        beaconGroup.scale.set(pulse, pulse, pulse)
      } else {
        beaconGroup.visible = false
      }

      // Compute Camera Position from Spherical Coordinates
      const sph = sphericalRef.current
      const cx = targetLookAtRef.current.x + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      const cy = targetLookAtRef.current.y + sph.radius * Math.cos(sph.phi)
      const cz = targetLookAtRef.current.z + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta)

      camera.position.set(cx, cy, cz)
      camera.lookAt(targetLookAtRef.current)

      // Billboards face camera
      nebulaeGroup.children.forEach(mesh => {
        mesh.lookAt(camera.position)
      })

      // Update Screen Coordinates of Visible Stars for UI Labels
      const currentRadius = sph.radius
      const labelData: Array<{
        id: string
        name: string
        x: number
        y: number
        visible: boolean
        isTarget: boolean
        tier: number
      }> = []

      const halfW = container.clientWidth / 2
      const halfH = container.clientHeight / 2
      const projVec = new THREE.Vector3()

      GALAXY_NODES_3D.forEach(node => {
        // Progressive Level of Detail (LOD)
        const isSelected = node.id === selectedNodeId
        const isHovered = node.id === hoveredNodeId
        const isFiltered = filteredNodeIds.has(node.id)

        // Visibility based on camera distance (LOD):
        // Tier 1: Always visible
        // Tier 2: Visible when distance < 420 or highlighted
        // Tier 3: Visible when distance < 260 or highlighted
        const shouldShow =
          isSelected ||
          isHovered ||
          (isFiltered &&
            (node.tier === 1 ||
              (node.tier === 2 && currentRadius < 450) ||
              (node.tier === 3 && currentRadius < 280)))

        if (shouldShow) {
          projVec.set(node.x, node.y, node.z)
          projVec.project(camera)

          // Check if behind camera
          if (projVec.z < 1) {
            const screenX = projVec.x * halfW + halfW
            const screenY = -projVec.y * halfH + halfH
            labelData.push({
              id: node.id,
              name: node.name,
              x: screenX,
              y: screenY,
              visible: true,
              isTarget: isSelected,
              tier: node.tier,
            })
          }
        }
      })

      // Batch update projected screen labels every 2 frames for optimal performance
      if (clockTick % 2 === 0) {
        setProjectedLabels(labelData)
      }

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    // 10. Pointer Interactions (Raycasting for Hover / Click)
    const onPointerMove = (e: globalThis.MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      mouseNDC.set(x, y)

      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x
        const deltaY = e.clientY - dragStartRef.current.y

        if (isRightDragRef.current) {
          // Pan Target in Camera Plane
          const panSpeed = sphericalRef.current.radius * 0.0016
          const right = new THREE.Vector3().crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize()
          targetLookAtRef.current.addScaledVector(right, deltaX * panSpeed)
          targetLookAtRef.current.addScaledVector(camera.up, deltaY * panSpeed)
        } else {
          // Orbit Around Target
          const orbitSpeed = 0.0055
          sphericalRef.current.theta = dragStartSphericalRef.current.theta - deltaX * orbitSpeed
          sphericalRef.current.phi = Math.max(
            0.15,
            Math.min(Math.PI - 0.15, dragStartSphericalRef.current.phi - deltaY * orbitSpeed)
          )
        }
      } else {
        // Raycast Nearest Celestial Star
        raycaster.setFromCamera(mouseNDC, camera)
        const hitMeshes = starHitSpheres.map(s => s.mesh)
        const intersects = raycaster.intersectObjects(hitMeshes, false)

        if (intersects.length > 0) {
          const hit = starHitSpheres.find(s => s.mesh === intersects[0].object)
          if (hit) {
            setHoveredNodeId(hit.id)
            canvas.style.cursor = 'pointer'
            return
          }
        }
        setHoveredNodeId(null)
        canvas.style.cursor = 'grab'
      }
    }

    const onPointerDown = (e: globalThis.MouseEvent) => {
      isDraggingRef.current = true
      isRightDragRef.current = e.button === 2 || e.shiftKey
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      dragStartSphericalRef.current = {
        theta: sphericalRef.current.theta,
        phi: sphericalRef.current.phi,
        radius: sphericalRef.current.radius,
      }
      canvas.style.cursor = 'grabbing'
    }

    const onPointerUp = (e: globalThis.MouseEvent) => {
      const wasDragging =
        Math.abs(e.clientX - dragStartRef.current.x) > 4 || Math.abs(e.clientY - dragStartRef.current.y) > 4
      isDraggingRef.current = false
      canvas.style.cursor = 'grab'

      // If clicked without dragging, select the intersected star
      if (!wasDragging && e.button === 0) {
        raycaster.setFromCamera(mouseNDC, camera)
        const hitMeshes = starHitSpheres.map(s => s.mesh)
        const intersects = raycaster.intersectObjects(hitMeshes, false)

        if (intersects.length > 0) {
          const hit = starHitSpheres.find(s => s.mesh === intersects[0].object)
          if (hit) {
            flyCameraToNode(hit.id)
          }
        }
      }
    }

    const onWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 0.9 : 1.11
      sphericalRef.current.radius = Math.max(110, Math.min(750, sphericalRef.current.radius * factor))
      setCameraDistance(Math.round(sphericalRef.current.radius))
    }

    canvas.addEventListener('mousemove', onPointerMove)
    canvas.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mouseup', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('contextmenu', e => e.preventDefault())

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', onPointerMove)
      canvas.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mouseup', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      renderer.dispose()
      starfieldGeo.dispose()
      starfieldMat.dispose()
      linesGeo.dispose()
      lineMat.dispose()
      pulsesGeo.dispose()
      pulsesMat.dispose()
      starCoreTex.dispose()
      starHaloTex.dispose()
      diffractionTex.dispose()
    }
  }, [flyCameraToNode, isAutoOrbit, filteredNodeIds, hoveredNodeId, nodeMap, selectedNodeId])

  // Touch Interactions
  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      dragStartSphericalRef.current = {
        theta: sphericalRef.current.theta,
        phi: sphericalRef.current.phi,
        radius: sphericalRef.current.radius,
      }
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      lastTouchDistRef.current = dist
    }
  }

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - dragStartRef.current.x
      const deltaY = e.touches[0].clientY - dragStartRef.current.y
      const orbitSpeed = 0.007
      sphericalRef.current.theta = dragStartSphericalRef.current.theta - deltaX * orbitSpeed
      sphericalRef.current.phi = Math.max(
        0.15,
        Math.min(Math.PI - 0.15, dragStartSphericalRef.current.phi - deltaY * orbitSpeed)
      )
    } else if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const ratio = lastTouchDistRef.current / dist
      sphericalRef.current.radius = Math.max(110, Math.min(750, sphericalRef.current.radius * ratio))
      lastTouchDistRef.current = dist
      setCameraDistance(Math.round(sphericalRef.current.radius))
    }
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
    lastTouchDistRef.current = null
  }

  return (
    <div
      ref={containerRef}
      className="knowledge-galaxy-container celestial-3d-theme"
      role="region"
      aria-label="3D Knowledge Universe & Celestial Constellation"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="knowledge-galaxy-canvas"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* 3D Projected Screen Labels (Crisp Typography Overlay) */}
      <div className="galaxy-labels-layer" aria-hidden="true">
        {projectedLabels.map(label => {
          const isSelected = label.id === selectedNodeId
          const isHovered = label.id === hoveredNodeId
          return (
            <div
              key={label.id}
              className={`celestial-star-label ${isSelected ? 'is-selected' : ''} ${
                isHovered ? 'is-hovered' : ''
              } tier-${label.tier}`}
              style={{
                transform: `translate3d(${label.x}px, ${label.y + (isSelected ? 18 : 12)}px, 0) translate(-50%, 0)`,
              }}
              onClick={() => flyCameraToNode(label.id)}
            >
              <span>{label.name}</span>
            </div>
          )
        })}
      </div>

      {/* TOP HUD: Search & Celestial Categories */}
      <header className="galaxy-top-hud">
        <div className="galaxy-hud-row">
          {/* Search Bar */}
          <div className="galaxy-search-wrapper">
            <Search size={15} className="galaxy-search-icon" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 57 stars: C, ML, Physics, Degrees, Projects..."
              className="galaxy-search-input"
              aria-label="Search Knowledge Universe"
            />
            {searchQuery && (
              <button
                type="button"
                className="galaxy-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick HUD Metrics Badge */}
          <div className="galaxy-metrics-pill" title="Universe Composition">
            <Atom size={14} className="metrics-icon" />
            <span className="metrics-val">{GALAXY_NODES_3D.length}</span>
            <span className="metrics-lbl">Stars</span>
            <span className="metrics-dot">•</span>
            <span className="metrics-val">{GALAXY_LINKS_3D.length}</span>
            <span className="metrics-lbl">Harmonic Bonds</span>
            <span className="metrics-dot">•</span>
            <span className="metrics-lbl">{cameraDistance} AU</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <nav className="galaxy-category-nav" aria-label="Constellation Categories">
          <button
            type="button"
            className={`galaxy-category-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Clusters ({GALAXY_NODES_3D.length})
          </button>
          {(Object.keys(CATEGORIES) as ClusterCategory[])
            .filter(cat => cat !== 'core')
            .map(cat => {
              const info = CATEGORIES[cat]
              const count = GALAXY_NODES_3D.filter(n => n.category === cat).length
              return (
                <button
                  key={cat}
                  type="button"
                  className={`galaxy-category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    borderColor: activeCategory === cat ? info.color : undefined,
                    color: activeCategory === cat ? info.color : undefined,
                  }}
                >
                  <span
                    className="category-pill-dot"
                    style={{ background: info.color, boxShadow: `0 0 6px ${info.color}` }}
                  />
                  <span>{info.label}</span>
                  <span className="category-pill-count">{count}</span>
                </button>
              )
            })}
        </nav>
      </header>

      {/* FLOATING 3D HUD CAMERA CONTROLS */}
      <div className="galaxy-hud-controls" role="group" aria-label="Camera Controls">
        <button
          type="button"
          className="hud-btn"
          onClick={() => zoomBy(0.82)}
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          className="hud-btn"
          onClick={() => zoomBy(1.22)}
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          className="hud-btn"
          onClick={reset3DView}
          title="Reset Universe Overview (⟲)"
          aria-label="Reset galaxy overview"
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          className="hud-btn highlight"
          onClick={() => flyCameraToNode('core-aman')}
          title="Fly to Aman Kumar Core (☉)"
          aria-label="Focus Aman Kumar Core"
        >
          <Compass size={16} />
        </button>
        <button
          type="button"
          className={`hud-btn ${isAutoOrbit ? 'active-orbit' : ''}`}
          onClick={() => setIsAutoOrbit(val => !val)}
          title={isAutoOrbit ? 'Stop Cosmic Auto-Orbit' : 'Start Cosmic Auto-Orbit'}
          aria-label="Toggle Auto-Orbit"
        >
          <OrbitIcon size={16} />
        </button>
      </div>

      {/* QUICK INSTRUCTION HINT */}
      <div className="galaxy-quick-hint" aria-hidden="true">
        <Sparkles size={13} className="hint-icon" />
        <span>3D Drag to Orbit • Right-Click/Shift to Pan • Scroll to Zoom • Click Stars to Fly</span>
      </div>

      {/* RIGHT SIDEBAR: GLASSMORPHISM DETAIL PANEL */}
      <AnimatePresence>
        {isDetailOpen && selectedNode && (
          <motion.aside
            className="galaxy-detail-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label={`${selectedNode.name} Celestial Details`}
          >
            {/* Header */}
            <div className="detail-panel-header">
              <div className="detail-category-badge" style={{ color: selectedNode.color }}>
                <span
                  className="badge-dot"
                  style={{ background: selectedNode.color, boxShadow: `0 0 8px ${selectedNode.color}` }}
                />
                <span>{selectedNode.categoryLabel}</span>
              </div>
              <button
                type="button"
                className="detail-close-btn"
                onClick={() => setIsDetailOpen(false)}
                aria-label="Close detail panel"
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="detail-panel-body">
              <div className="detail-title-row">
                <div
                  className="detail-node-avatar"
                  style={{
                    background: `radial-gradient(circle, ${selectedNode.color}40, transparent)`,
                    borderColor: selectedNode.color,
                  }}
                >
                  <div
                    className="avatar-core"
                    style={{ background: selectedNode.color, boxShadow: `0 0 14px ${selectedNode.color}` }}
                  />
                </div>
                <div>
                  <h2 className="detail-node-title">{selectedNode.name}</h2>
                  <p className="detail-node-tagline">{selectedNode.tagline}</p>
                </div>
              </div>

              {/* Spectral Star Profile */}
              <div className="celestial-spectral-card">
                <span className="spectral-lbl">Spectral Classification:</span>
                <span className="spectral-val" style={{ color: selectedNode.color }}>
                  {selectedNode.spectralType}
                </span>
              </div>

              {/* Description */}
              <div className="detail-desc-box">
                <p>{selectedNode.description}</p>
              </div>

              {/* Academic Context (if present) */}
              {selectedNode.academicContext && (
                <div className="detail-meta-section">
                  <h3 className="detail-meta-title">Academic Context</h3>
                  <div className="academic-highlight-pill">
                    <Info size={12} />
                    <span>{selectedNode.academicContext}</span>
                  </div>
                </div>
              )}

              {/* Related Skills / Technologies */}
              {selectedNode.relatedSkills && selectedNode.relatedSkills.length > 0 && (
                <div className="detail-meta-section">
                  <h3 className="detail-meta-title">Harmonically Connected Skills</h3>
                  <div className="detail-tag-cloud">
                    {selectedNode.relatedSkills.map(skill => {
                      const matchNode = GALAXY_NODES_3D.find(
                        n => n.name.toLowerCase() === skill.toLowerCase()
                      )
                      return (
                        <button
                          key={skill}
                          type="button"
                          className="detail-skill-tag"
                          onClick={() => matchNode && flyCameraToNode(matchNode.id)}
                          title={matchNode ? `Fly to star: ${skill}` : undefined}
                        >
                          <span>{skill}</span>
                          {matchNode && <ChevronRight size={11} className="tag-arrow" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Connected Projects */}
              {selectedNode.connectedProjects && selectedNode.connectedProjects.length > 0 && (
                <div className="detail-meta-section">
                  <h3 className="detail-meta-title">Connected Engineering Projects</h3>
                  <div className="detail-projects-list">
                    {selectedNode.connectedProjects.map(proj => {
                      const matchProj = GALAXY_NODES_3D.find(
                        n =>
                          n.name.toLowerCase() === proj.toLowerCase() ||
                          n.id.includes(proj.toLowerCase().replace(/\s+/g, '-'))
                      )
                      return (
                        <div key={proj} className="detail-project-card">
                          <div className="proj-card-info">
                            <span className="proj-card-name">{proj}</span>
                            {matchProj && (
                              <button
                                type="button"
                                className="proj-focus-btn"
                                onClick={() => flyCameraToNode(matchProj.id)}
                                title="Fly camera to project star"
                              >
                                Fly to Star <Compass size={11} />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation Link */}
            <div className="detail-panel-footer">
              <button
                type="button"
                className="detail-btn secondary"
                onClick={() => flyCameraToNode(selectedNode.id)}
              >
                <Compass size={14} />
                <span>Focus Star</span>
              </button>

              {selectedNode.routeLink && (
                <Link to={selectedNode.routeLink} className="detail-btn primary">
                  <span>{selectedNode.linkText || 'Explore Details'}</span>
                  <ArrowRight size={14} />
                </Link>
              )}

              {selectedNode.externalLink && !selectedNode.routeLink && (
                <a
                  href={selectedNode.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-btn primary"
                >
                  <span>{selectedNode.linkText || 'View External'}</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
