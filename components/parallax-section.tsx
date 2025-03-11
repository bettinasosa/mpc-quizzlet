"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

type ParallaxSectionProps = {
  children: React.ReactNode
  className?: string
  baseVelocity?: number
}

export default function ParallaxSection({ children, className = "", baseVelocity = 5 }: ParallaxSectionProps) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${baseVelocity * 100}%`])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative">
        {children}
      </motion.div>
    </div>
  )
}

