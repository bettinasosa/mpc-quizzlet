"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"

interface GlitchEffectProps {
  children: React.ReactNode
  intensity?: "low" | "medium" | "high"
  interval?: number
}

export default function GlitchEffect({ children, intensity = "medium", interval = 5000 }: GlitchEffectProps) {
  const controls = useAnimation()
  const [isGlitching, setIsGlitching] = useState(false)
  const isMounted = useRef(false)

  // Intensity settings
  const glitchDuration = {
    low: 0.2,
    medium: 0.4,
    high: 0.6,
  }

  const glitchStrength = {
    low: 2,
    medium: 5,
    high: 10,
  }

  // Trigger glitch effect at intervals
  useEffect(() => {
    isMounted.current = true

    const triggerGlitch = () => {
      if (!isMounted.current) return

      setIsGlitching(true)

      // Sequence of rapid movements
      controls
        .start({
          x: [0, glitchStrength[intensity], -glitchStrength[intensity] * 0.5, glitchStrength[intensity] * 0.8, 0],
          y: [
            0,
            -glitchStrength[intensity] * 0.3,
            glitchStrength[intensity] * 0.5,
            -glitchStrength[intensity] * 0.2,
            0,
          ],
          filter: ["none", "hue-rotate(90deg)", "none", "saturate(200%)", "none"],
          transition: {
            duration: glitchDuration[intensity],
            times: [0, 0.2, 0.4, 0.6, 1],
          },
        })
        .then(() => {
          if (isMounted.current) {
            setIsGlitching(false)
          }
        })
    }

    // Initial glitch
    triggerGlitch()

    // Set up interval
    const intervalId = setInterval(triggerGlitch, interval)

    return () => {
      isMounted.current = false
      clearInterval(intervalId)
    }
  }, [controls, intensity, interval])

  return (
    <div className="relative overflow-hidden">
      {/* Main content */}
      <motion.div animate={controls}>{children}</motion.div>

      {/* Glitch layers - only visible during glitch */}
      {isGlitching && (
        <>
          <motion.div
            className="absolute inset-0 opacity-30 text-red-500 mix-blend-screen"
            animate={{
              x: [0, -glitchStrength[intensity], 0, glitchStrength[intensity], 0],
              transition: {
                duration: glitchDuration[intensity] * 0.5,
                times: [0, 0.25, 0.5, 0.75, 1],
              },
            }}
          >
            {children}
          </motion.div>

          <motion.div
            className="absolute inset-0 opacity-30 text-blue-500 mix-blend-screen"
            animate={{
              x: [0, glitchStrength[intensity], 0, -glitchStrength[intensity], 0],
              transition: {
                duration: glitchDuration[intensity] * 0.5,
                times: [0, 0.25, 0.5, 0.75, 1],
              },
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </div>
  )
}

