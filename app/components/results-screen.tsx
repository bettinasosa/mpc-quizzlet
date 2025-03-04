"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { personalityData } from "../data"
import CyberButton from "./CyberButton"

interface ResultsScreenProps {
  personalityType: string
  onRestart: () => void
}

function CSSPersonalityModel({ personalityType }: { personalityType: string }) {
  // Different shapes and colors for each personality type
  const models: Record<string, { shape: string; color: string; glow: string }> =
    {
      Degen: {
        shape: "octagon",
        color: "#ff6b6b",
        glow: "0 0 30px rgba(255, 107, 107, 0.6)"
      },
      Influencer: {
        shape: "circle",
        color: "#4dabf7",
        glow: "0 0 30px rgba(77, 171, 247, 0.6)"
      },
      "NFT Enthusiast": {
        shape: "hexagon",
        color: "#ffd43b",
        glow: "0 0 30px rgba(255, 212, 59, 0.6)"
      },
      "DeFi Expert": {
        shape: "pentagon",
        color: "#69db7c",
        glow: "0 0 30px rgba(105, 219, 124, 0.6)"
      },
      Developer: {
        shape: "square",
        color: "#da77f2",
        glow: "0 0 30px rgba(218, 119, 242, 0.6)"
      },
      HODLer: {
        shape: "triangle",
        color: "#4c6ef5",
        glow: "0 0 30px rgba(76, 110, 245, 0.6)"
      },
      "Privacy Advocate": {
        shape: "diamond",
        color: "#ff922b",
        glow: "0 0 30px rgba(255, 146, 43, 0.6)"
      },
      Trader: {
        shape: "rectangle",
        color: "#20c997",
        glow: "0 0 30px rgba(32, 201, 151, 0.6)"
      }
    }

  const model = models[personalityType] || models["Developer"]

  const getShapeStyle = () => {
    switch (model.shape) {
      case "circle":
        return {
          borderRadius: "50%"
        }
      case "triangle":
        return {
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
        }
      case "square":
        return {
          borderRadius: "10%"
        }
      case "rectangle":
        return {
          borderRadius: "10%",
          width: "120px",
          height: "80px"
        }
      case "pentagon":
        return {
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
        }
      case "hexagon":
        return {
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
        }
      case "octagon":
        return {
          clipPath:
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
        }
      case "diamond":
        return {
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
        }
      default:
        return {
          borderRadius: "10%"
        }
    }
  }

  return (
    <div className="relative h-64 flex items-center justify-center">
      {/* Floating effect with animation */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -15, 0],
          rotateY: [0, 360],
          rotateX: [0, 45, 0]
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          },
          rotateY: {
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear"
          },
          rotateX: {
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }
        }}
      >
        {/* Main shape */}
        <div
          className="w-32 h-32 bg-opacity-80"
          style={{
            ...getShapeStyle(),
            background: `linear-gradient(135deg, ${model.color}, ${model.color}80)`,
            boxShadow: model.glow
          }}
        />

        {/* Glow effect */}
        <div
          className="absolute inset-0 blur-xl opacity-50"
          style={{
            ...getShapeStyle(),
            background: model.color
          }}
        />

        {/* Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: model.color,
              boxShadow: `0 0 5px ${model.color}`
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>

      {/* Orbiting particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            border: `1px solid ${model.color}40`
          }}
          animate={{
            rotateZ: [0, 360],
            rotateX: [0, 30, 0, -30, 0],
            rotateY: [0, -30, 0, 30, 0]
          }}
          transition={{
            rotateZ: {
              duration: 10 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            },
            rotateX: {
              duration: 15 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            },
            rotateY: {
              duration: 20 + i * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }
          }}
        >
          {/* Particle on the orbit */}
          <motion.div
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: model.color,
              boxShadow: `0 0 5px ${model.color}`,
              top: "0%",
              left: "50%",
              marginLeft: "-1.5px"
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default function ResultsScreen({
  personalityType,
  onRestart
}: ResultsScreenProps) {
  const [showDetails, setShowDetails] = useState(false)
  const personality =
    personalityData[personalityType as keyof typeof personalityData]
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setShowDetails(true)
      }
    }, 1000)
    return () => {
      isMounted.current = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-4rem)] overflow-y-auto space-y-8 p-4"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center text-white"
      >
        Your Crypto Personality:
      </motion.h2>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative rounded-2xl overflow-hidden"
      >
        {/* Background with animated gradient */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"]
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse"
            }}
          />
        </div>

        <div className="relative p-8">
          <CSSPersonalityModel personalityType={personalityType} />

          <motion.h3
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6"
          >
            {personalityType}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-purple-200/90 text-center mb-8"
          >
            {personality.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 20 }}
            className="space-y-6"
          >
            <div>
              <h4 className="text-2xl font-semibold text-white mb-4">
                Your Crypto Traits:
              </h4>
              <div className="grid gap-4">
                {personality.traits.map((trait, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="relative p-4 rounded-xl overflow-hidden group"
                  >
                    {/* Trait background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm" />

                    {/* Trait content */}
                    <div className="relative flex items-center gap-3">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-purple-400"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.2
                        }}
                      />
                      <span className="text-lg text-white">{trait}</span>
                    </div>

                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100"
                      whileHover={{ opacity: 0.2 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* How it works section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showDetails ? 1 : 0 }}
        transition={{ delay: 1.2 }}
        className="relative p-6 rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm" />

        <div className="relative">
          <h3 className="text-2xl font-semibold text-white mb-4">
            How This Works
          </h3>
          <p className="text-purple-200/90 mb-4">
            Your answers were securely encrypted and processed using advanced
            Multi-Party Computation (MPC) on the Partisia blockchain. This
            ensures that even if your raw data were ever exposed, only the final
            personality result is revealed – your individual responses remain
            private.
          </p>
          <p className="text-purple-200/70 italic">
            Imagine if these insights were sold to advertisers – they'd know all
            about your crypto investment habits! MPC protects you from that
            risk.
          </p>
        </div>
      </motion.div>

      {/* Restart button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showDetails ? 1 : 0, y: showDetails ? 0 : 20 }}
        transition={{ delay: 1.5 }}
        className="flex justify-center"
      >
        <CyberButton onClick={onRestart} size="large" variant="primary">
          Take Quiz Again
        </CyberButton>
      </motion.div>
    </motion.div>
  )
}
