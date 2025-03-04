"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface LoadingScreenProps {
  onComplete: () => void
}

// CSS-based loading cube instead of WebGL
function CSSLoadingCube() {
  return (
    <div className="relative perspective">
      <motion.div
        className="w-32 h-32 relative transform-3d"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {/* Front face */}
        <div className="absolute inset-0 bg-purple-600/30 border border-purple-500/50 transform translate-z-[16px]" />

        {/* Back face */}
        <div className="absolute inset-0 bg-blue-600/30 border border-blue-500/50 transform translate-z-[-16px] rotate-y-180" />

        {/* Left face */}
        <div className="absolute inset-0 bg-pink-600/30 border border-pink-500/50 transform translate-x-[-16px] rotate-y-90" />

        {/* Right face */}
        <div className="absolute inset-0 bg-cyan-600/30 border border-cyan-500/50 transform translate-x-[16px] rotate-y-[-90deg]" />

        {/* Top face */}
        <div className="absolute inset-0 bg-amber-600/30 border border-amber-500/50 transform translate-y-[-16px] rotate-x-90" />

        {/* Bottom face */}
        <div className="absolute inset-0 bg-green-600/30 border border-green-500/50 transform translate-y-[16px] rotate-x-[-90deg]" />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-xl"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0) 70%)",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Orbiting particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/30"
          style={{
            width: `${80 + i * 30}px`,
            height: `${80 + i * 30}px`,
          }}
          animate={{
            rotateZ: [0, 360],
            rotateX: [0, 30, 0, -30, 0],
          }}
          transition={{
            rotateZ: {
              duration: 5 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            rotateX: {
              duration: 7 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        >
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-purple-500"
            style={{
              top: "0%",
              left: "50%",
              marginLeft: "-1px",
              boxShadow: "0 0 5px rgba(139, 92, 246, 0.7)",
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("Initializing secure computation...")
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    const messages = [
      "Initializing secure computation...",
      "Encrypting your secret responses...",
      "Performing multi-party computation...",
      "Aggregating results securely...",
      "Finalizing your crypto personality...",
    ]

    let interval: NodeJS.Timeout
    let messageIndex = 0

    const updateProgress = () => {
      if (!isMounted.current) return

      setProgress((prev) => {
        const newProgress = prev + Math.random() * 2

        if (newProgress > 20 && messageIndex === 0) {
          messageIndex++
          setMessage(messages[messageIndex])
        } else if (newProgress > 40 && messageIndex === 1) {
          messageIndex++
          setMessage(messages[messageIndex])
        } else if (newProgress > 60 && messageIndex === 2) {
          messageIndex++
          setMessage(messages[messageIndex])
        } else if (newProgress > 80 && messageIndex === 3) {
          messageIndex++
          setMessage(messages[messageIndex])
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (isMounted.current) {
              onComplete()
            }
          }, 500)
          return 100
        }
        return newProgress
      })
    }

    interval = setInterval(updateProgress, 100)

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center space-y-8"
    >
      <motion.h2 className="text-3xl font-bold text-white" initial={{ y: -20 }} animate={{ y: 0 }}>
        Hang Tight! Your secure computation is underway...
      </motion.h2>

      {/* CSS 3D Loading Animation */}
      <div className="h-64 mb-4 flex items-center justify-center">
        <div className="relative">
          <CSSLoadingCube />
          <motion.div
            className="absolute top-[calc(100%+20px)] left-1/2 -translate-x-1/2 text-xl font-bold text-white"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="h-4 bg-purple-900/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-purple-300/70">
          <span>Initializing</span>
          <span>Processing</span>
          <span>Finalizing</span>
        </div>
      </div>

      {/* Status message */}
      <motion.div
        className="text-xl text-purple-300"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        {message}
      </motion.div>

      {/* Data visualization */}
      <div className="relative h-16 w-full max-w-md mx-auto">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 bg-purple-500/50 w-3 rounded-t-md"
            style={{ left: `${i * 5}%` }}
            animate={{
              height: [`${Math.random() * 30 + 10}%`, `${Math.random() * 70 + 30}%`, `${Math.random() * 30 + 10}%`],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.p
        className="text-purple-300/70 text-center max-w-lg mx-auto italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Your data is being processed with advanced encryption.
        <br />
        This ensures your privacy while we calculate your crypto personality.
      </motion.p>
    </motion.div>
  )
}

