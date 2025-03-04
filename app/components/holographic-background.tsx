"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function HolographicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    // Only run canvas code on client side
    if (typeof window === "undefined") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    // Only add event listeners on client side
    window.addEventListener("resize", resizeCanvas)

    // Create gradient
    const createGradient = () => {
      if (!ctx || !canvas) return ctx?.createLinearGradient(0, 0, 0, 0)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(76, 29, 149, 0.1)")
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)")
      gradient.addColorStop(1, "rgba(139, 92, 246, 0.1)")
      return gradient
    }

    // Grid parameters
    const gridSize = 50
    const lineWidth = 1

    // Animation parameters
    let time = 0
    const speed = 0.001

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const mouseRadius = 200

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Only add event listeners on client side
    canvas.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    let animationId: number

    function animate() {
      if (!ctx || !canvas || !isMounted.current) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid
      ctx.strokeStyle = createGradient() || "rgba(139, 92, 246, 0.1)"
      ctx.lineWidth = lineWidth

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()

        for (let x = 0; x < canvas.width; x += 5) {
          // Calculate distance from mouse
          const dx = x - mouseX
          const dy = y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Wave effect
          const wave = Math.sin(x * 0.01 + time) * 5

          // Mouse interaction
          let distortion = 0
          if (distance < mouseRadius) {
            distortion = (1 - distance / mouseRadius) * 30
          }

          const yPos = y + wave + distortion

          if (x === 0) {
            ctx.moveTo(x, yPos)
          } else {
            ctx.lineTo(x, yPos)
          }
        }

        ctx.stroke()
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()

        for (let y = 0; y < canvas.height; y += 5) {
          // Calculate distance from mouse
          const dx = x - mouseX
          const dy = y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Wave effect
          const wave = Math.sin(y * 0.01 + time) * 5

          // Mouse interaction
          let distortion = 0
          if (distance < mouseRadius) {
            distortion = (1 - distance / mouseRadius) * 30
          }

          const xPos = x + wave + distortion

          if (y === 0) {
            ctx.moveTo(xPos, y)
          } else {
            ctx.lineTo(xPos, y)
          }
        }

        ctx.stroke()
      }

      // Add floating particles
      for (let i = 0; i < 20; i++) {
        const x = Math.sin(time * 0.5 + i) * canvas.width * 0.4 + canvas.width * 0.5
        const y = Math.cos(time * 0.5 + i) * canvas.height * 0.4 + canvas.height * 0.5
        const size = Math.sin(time + i) * 2 + 3

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${(time * 50 + i * 20) % 360}, 70%, 60%, 0.3)`
        ctx.fill()
      }

      // Update time
      time += speed

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isMounted.current = false
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />

      {/* Additional animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, hsl(${(i * 60) % 360}, 70%, 50%), transparent)`,
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              top: `${10 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10" />
    </>
  )
}

