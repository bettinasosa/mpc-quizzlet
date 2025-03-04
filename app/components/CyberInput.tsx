"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"

interface CyberInputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export default function CyberInput({ type = "text", placeholder, value, onChange, disabled = false }: CyberInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      className="relative"
      animate={{
        boxShadow: isFocused ? "0 0 20px rgba(139,92,246,0.3)" : "0 0 0px transparent",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl rounded-lg" />

      {/* Border */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-purple-500/30"
        animate={{
          opacity: isFocused ? 1 : 0.5,
        }}
      />

      {/* Input */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="relative w-full px-4 py-3 bg-transparent text-white placeholder-purple-300/50 outline-none rounded-lg"
      />

      {/* Glow lines */}
      {isFocused && (
        <>
          <motion.div
            className="absolute bottom-0 left-1/2 w-0 h-px bg-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
            style={{ transform: "translateX(-50%)" }}
          />
          <motion.div
            className="absolute top-0 left-1/2 w-0 h-px bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
            style={{ transform: "translateX(-50%)" }}
          />
        </>
      )}
    </motion.div>
  )
}

