"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

type TextRevealProps = {
  children: React.ReactNode
  width?: "full" | "auto"
  delay?: number
}

export default function TextReveal({ children, width = "auto", delay = 0 }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const variants = {
    hidden: { width: 0 },
    visible: {
      width: width === "full" ? "100%" : "auto",
      transition: {
        delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div ref={ref} className="relative inline-block overflow-hidden">
      <div className="invisible">{children}</div>
      <motion.div
        className="absolute top-0 left-0"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
      >
        {children}
      </motion.div>
    </div>
  )
}

