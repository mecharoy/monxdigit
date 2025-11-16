'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.3,
          hue: Math.random() * 60 + 180, // Blue to purple range
        })
      }
      return particles
    }

    particlesRef.current = createParticles()

    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Scroll tracking
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll)

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 26, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const scrollProgress = scrollRef.current / (document.body.scrollHeight - window.innerHeight)

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX + scrollProgress * 0.5
        particle.y += particle.speedY + scrollProgress * 0.3

        // Wrap around screen
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          particle.x -= (dx / distance) * force * 2
          particle.y -= (dy / distance) * force * 2
        }

        // Pulsate based on scroll
        const pulse = Math.sin(Date.now() * 0.001 + index * 0.1) * 0.3 + 0.7

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4
        )

        // Color changes with scroll
        const hue = particle.hue + scrollProgress * 60
        gradient.addColorStop(0, `hsla(${hue}, 80%, 70%, ${particle.opacity * pulse})`)
        gradient.addColorStop(0.5, `hsla(${hue}, 80%, 60%, ${particle.opacity * pulse * 0.5})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core particle
        ctx.fillStyle = `hsla(${hue}, 90%, 85%, ${particle.opacity * pulse})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Connect nearby particles
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.3
            const hue = 200 + scrollProgress * 40
            ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
