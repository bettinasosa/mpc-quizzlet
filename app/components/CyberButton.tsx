"use client"

import type React from "react"

import { motion, useAnimation } from "framer-motion"
import { useState, useEffect, useRef } from "react"

interface CyberButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger"
  size?: "normal" | "large"
  glowColor?: string
  glitchOnHover?: boolean
}

export default function CyberButton({
  onClick,
  disabled = false,
  children,
  variant = "primary",
  size = "normal",
  glowColor,
  glitchOnHover = true
}: CyberButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const controls = useAnimation()
  const isMounted = useRef(false)

  // Default glow colors based on variant
  const defaultGlowColors = {
    primary: "rgba(139,92,246,0.5)",
    secondary: "rgba(156,163,175,0.5)",
    danger: "rgba(239,68,68,0.5)"
  }

  const finalGlowColor = glowColor || defaultGlowColors[variant]

  // Base styles
  const baseStyles =
    "relative font-bold text-white transition-all duration-300 overflow-hidden"
  const sizeStyles =
    size === "large" ? "px-8 py-4 text-xl" : "px-6 py-3 text-lg"

  // Variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600",
    secondary: "bg-gradient-to-r from-gray-700 to-gray-600",
    danger: "bg-gradient-to-r from-red-600 to-pink-600"
  }

  // Glitch effect on hover - only run on client side
  useEffect(() => {
    isMounted.current = true

    if (isHovered && glitchOnHover && !disabled && isMounted.current) {
      const glitchSequence = async () => {
        await controls.start({
          x: [0, -3, 3, -2, 0],
          transition: { duration: 0.2 }
        })
      }

      glitchSequence()
    }

    return () => {
      isMounted.current = false
    }
  }, [isHovered, controls, disabled, glitchOnHover])

  return (
    <motion.button
      onClick={() => {
        if (!disabled) {
          onClick()
        }
      }}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      animate={controls}
      className={`
        ${baseStyles}
        ${sizeStyles}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        rounded-xl
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {/* Background with animated gradient */}
      <motion.div
        className={`absolute inset-0 ${variantStyles[variant]}`}
        animate={{
          backgroundPosition:
            isHovered && !disabled ? ["0% 0%", "100% 0%"] : "0% 0%"
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse"
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          boxShadow:
            isHovered && !disabled
              ? `0 0 20px ${finalGlowColor}`
              : `0 0 0px transparent`
        }}
      />

      {/* Border effect */}
      <div className="absolute inset-0" />

      {/* Scan line effect */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
          initial={{ y: "-100%" }}
          animate={{ y: "200%" }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear"
          }}
        />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 z-10">
        {children}
      </div>

      {/* Press effect - inner shadow */}
      {isPressed && !disabled && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      {/* Animated particles on hover */}
      {isHovered && !disabled && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: "50%",
                y: "50%",
                opacity: 1
              }}
              animate={{
                x: `${50 + (Math.random() * 100 - 50)}%`,
                y: `${50 + (Math.random() * 100 - 50)}%`,
                opacity: 0
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop"
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  )
}
