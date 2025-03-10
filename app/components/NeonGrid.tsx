"use client"

import { motion } from "framer-motion"

export default function NeonGrid() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            y: ["0%", "100%"],
          }}
          transition={{
            duration: 20,
            delay: i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
          style={{
            top: `${(i / 20) * 100}%`,
          }}
        />
      ))}

      {/* Vertical lines */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 20,
            delay: i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
          style={{
            left: `${(i / 20) * 100}%`,
          }}
        />
      ))}

      {/* Glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 2 === 0 ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.15)"
            } 0%, transparent 70%)`,
          }}
          animate={{
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

