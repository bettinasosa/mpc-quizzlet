"use client"

import type React from "react"

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  useAnimate
} from "framer-motion"
import { useEffect, useState, useRef } from "react"
import CyberButton from "./CyberButton"
import { Shield, Layers, Network, Cpu, Key, Database } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
}

// Parallax section component
const ParallaxSection = ({
  children,
  depth = 0.2
}: {
  children: React.ReactNode
  depth?: number
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, depth * 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="relative">
      {children}
    </motion.div>
  )
}

// 3D Floating Card component
const FloatingCard = ({
  icon,
  title,
  description,
  color,
  delay = 0
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay?: number
}) => {
  const [hover, setHover] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="relative perspective"
    >
      <motion.div
        className="relative p-6 rounded-xl overflow-hidden group cursor-pointer"
        animate={{
          rotateX: hover ? 10 : 0,
          rotateY: hover ? 10 : 0,
          z: hover ? 20 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background with depth layers */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 backdrop-blur-sm rounded-xl border border-white/10"
          style={{ transform: "translateZ(0px)" }}
        />

        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}05)`,
            transform: "translateZ(10px)",
            boxShadow: `0 0 20px ${color}30`
          }}
        />

        {/* Content with 3D depth */}
        <div className="relative" style={{ transform: "translateZ(20px)" }}>
          <motion.div
            className="mb-4 p-3 rounded-full inline-block"
            style={{ background: `${color}20` }}
            animate={{
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: delay * 0.5
            }}
          >
            <div className="text-2xl" style={{ color }}>
              {icon}
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-purple-200/70">{description}</p>
        </div>

        {/* Particle effects on hover */}
        {hover && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ background: color }}
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 0
                }}
                animate={{
                  x: `${50 + (Math.random() * 100 - 50)}%`,
                  y: `${50 + (Math.random() * 100 - 50)}%`,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1 + Math.random() * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

// 3D Blockchain visualization
const BlockchainVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scope, animate] = useAnimate()

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5

    setMousePosition({ x, y })
  }

  useEffect(() => {
    animate(
      scope.current,
      {
        rotateY: mousePosition.x * 10,
        rotateX: -mousePosition.y * 10
      },
      { type: "spring", stiffness: 100, damping: 30 }
    )
  }, [mousePosition, animate, scope])

  // Chain of blocks
  const blocks = [
    { color: "#8b5cf6", icon: <Layers size={24} /> },
    { color: "#3b82f6", icon: <Database size={24} /> },
    { color: "#ec4899", icon: <Key size={24} /> },
    { color: "#10b981", icon: <Shield size={24} /> },
    { color: "#f59e0b", icon: <Cpu size={24} /> }
  ]

  return (
    <div
      ref={containerRef}
      className="relative h-80 w-full flex items-center justify-center perspective"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        ref={scope}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Connected blocks */}
        <div className="flex items-center space-x-4">
          {blocks.map((block, index) => (
            <div key={index} className="relative">
              {/* Block */}
              <motion.div
                className="w-16 h-16 rounded-lg flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${block.color}40, ${block.color}20)`,
                  border: `1px solid ${block.color}60`,
                  boxShadow: `0 0 20px ${block.color}30`,
                  transform: `translateZ(${index * 10}px)`
                }}
                animate={{
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              >
                <div className="text-white">{block.icon}</div>

                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-lg blur-md -z-10"
                  style={{ background: `${block.color}20` }}
                />
              </motion.div>

              {/* Connection line to next block */}
              {index < blocks.length - 1 && (
                <motion.div
                  className="absolute top-1/2 right-0 h-0.5 w-4 -mr-4"
                  style={{ background: `${block.color}80` }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    width: ["0%", "100%", "0%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Orbiting particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: blocks[i % blocks.length].color,
              boxShadow: `0 0 5px ${blocks[i % blocks.length].color}`,
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%"
            }}
            animate={{
              x: `calc(-50% + ${Math.sin(i) * (100 + i * 5)}px)`,
              y: `calc(-50% + ${Math.cos(i) * (50 + i * 3)}px)`,
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 10 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Animated text reveal
const AnimatedText = ({
  text,
  delay = 0
}: {
  text: string
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="overflow-hidden"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
      >
        {text}
      </motion.div>
    </motion.div>
  )
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 })

  const [showButton, setShowButton] = useState(false)

  useMotionValueEvent(scrollYProgress, "change", latest => {
    if (latest > 0.8) {
      setShowButton(true)
    }
  })

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden"
    >
      {/* Hero section with parallax */}
      <motion.div
        className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 relative"
        style={{
          opacity: springOpacity,
          y: springY,
          scale: springScale
        }}
      >
        {/* Animated title with smoother reveal */}
        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent relative z-10"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)",
              backgroundSize: "200% 200%"
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
          >
            <AnimatedText text="Discover Your" />
            <AnimatedText text="Crypto Identity" delay={0.2} />
          </motion.div>

          {/* Subtle glow effect */}
          <div
            className="absolute inset-0 blur-xl opacity-30 -z-10"
            style={{
              background:
                "linear-gradient(135deg, #8b5cf680 0%, #ec489980 50%, #3b82f680 100%)",
              backgroundSize: "200% 200%",
              animation: "gradient-shift 10s linear infinite"
            }}
          />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-purple-200/80 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <AnimatedText
            text="Explore your blockchain persona through our immersive personality quiz"
            delay={0.4}
          />
        </motion.p>

        {/* 3D Blockchain visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-2xl mb-12"
        >
          <BlockchainVisualization />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            delay: 1.5,
            duration: 2,
            repeat: Number.POSITIVE_INFINITY
          }}
        >
          <div className="flex flex-col items-center">
            <p className="text-purple-200/60 mb-2">Scroll to explore</p>
            <motion.div
              className="w-6 h-10 border-2 border-purple-400/30 rounded-full flex justify-center p-1"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1 h-2 bg-purple-400 rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Features section with parallax cards */}
      <div className="py-20 px-4">
        <ParallaxSection depth={0.1}>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Powered by Advanced Technology
          </motion.h2>
        </ParallaxSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FloatingCard
            icon={<Shield />}
            title="Privacy First"
            description="Your data stays yours with advanced encryption and zero-knowledge proofs"
            color="#8b5cf6"
            delay={0.2}
          />
          <FloatingCard
            icon={<Cpu />}
            title="MPC Secured"
            description="Multi-Party Computation ensures your answers remain private"
            color="#3b82f6"
            delay={0.4}
          />
          <FloatingCard
            icon={<Network />}
            title="Blockchain Native"
            description="Built for the decentralized future with chain-agnostic design"
            color="#ec4899"
            delay={0.6}
          />
        </div>
      </div>

      {/* Privacy notice with parallax */}
      <ParallaxSection depth={0.15}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto mb-20 p-8 rounded-xl relative overflow-hidden"
        >
          {/* Holographic background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-md rounded-xl" />

          {/* Animated border */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20"
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear"
              }}
            />
          </div>

          {/* Content */}
          <div className="relative">
            <motion.div
              className="flex items-center justify-center mb-6"
              animate={{
                rotateY: [0, 360]
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear"
              }}
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                />
                <Shield className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Privacy Notice
            </h3>
            <p className="text-purple-200/70 text-center">
              This quiz uses advanced Multi-Party Computation (MPC) to ensure
              your answers remain private. Your data is processed securely
              without exposing individual responses.
            </p>

            {/* Animated security visualization */}
            <div className="mt-6 h-8 relative overflow-hidden rounded-lg bg-black/20">
              <motion.div
                className="absolute inset-0 flex items-center"
                animate={{
                  x: [0, -100]
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear"
                }}
              >
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-10 flex justify-center"
                  >
                    <motion.div
                      className="h-1 w-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        width: ["30%", "80%", "30%"]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </ParallaxSection>

      {/* Start button with fixed position */}
      <motion.div
        className="sticky bottom-10 left-0 right-0 flex justify-center z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: showButton ? 1 : 0,
          y: showButton ? 0 : 50
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          {/* Pulsing background effect */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            }}
          />

          <CyberButton onClick={onStart} size="large" glitchOnHover={true}>
            <span className="mr-2">⚡</span>
            Begin Your Crypto Journey
            <span className="ml-2">⚡</span>
          </CyberButton>
        </div>
      </motion.div>
    </motion.div>
  )
}
