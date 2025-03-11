"use client"

import { motion } from "framer-motion"

type GeometricBackgroundProps = {
  variant?: "default" | "alt"
}

export default function GeometricBackground({ variant = "default" }: GeometricBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {variant === "default" ? (
        // Default variant with diagonal lines
        <svg className="absolute w-full h-full opacity-[0.02]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0 100L100 0"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M20 100L100 20"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
          />
          <motion.path
            d="M40 100L100 40"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
          />
        </svg>
      ) : (
        // Alt variant with grid pattern
        <svg className="absolute w-full h-full opacity-[0.02]" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(10)].map((_, i) => (
            <motion.line
              key={`v${i}`}
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2="100"
              stroke="currentColor"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.1, ease: "easeInOut" }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <motion.line
              key={`h${i}`}
              x1="0"
              y1={i * 10}
              x2="100"
              y2={i * 10}
              stroke="currentColor"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.1, ease: "easeInOut" }}
            />
          ))}
        </svg>
      )}
    </div>
  )
}

