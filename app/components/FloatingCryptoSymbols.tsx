"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

export default function FloatingCryptoSymbols() {
  const isMounted = useRef(false)

  // More diverse crypto symbols
  const symbols = [
    { symbol: "₿", color: "#F7931A" }, // Bitcoin
    { symbol: "Ξ", color: "#627EEA" }, // Ethereum
    { symbol: "◎", color: "#14F195" }, // Solana
    { symbol: "Ł", color: "#345D9D" }, // Litecoin
    { symbol: "Ð", color: "#C3A634" }, // Dogecoin
    { symbol: "⓪", color: "#2775CA" }, // USDC
    { symbol: "₳", color: "#0033AD" }, // Cardano
    { symbol: "Ƀ", color: "#FF9900" }, // Bitcoin Cash
    { symbol: "ꜩ", color: "#A6E3E9" }, // Tezos
    { symbol: "Ꞓ", color: "#26A17B" }, // Cosmos
    { symbol: "ℵ", color: "#E84142" }, // Avalanche
    { symbol: "∞", color: "#E6007A" }, // Polkadot
    { symbol: "⟠", color: "#2B6DEF" }, // Chainlink
    { symbol: "⚡", color: "#FD9800" }, // Lightning Network
    { symbol: "⋮", color: "#16C784" }, // Polygon
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {symbols.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-3xl font-bold"
          style={{
            color: item.color,
            textShadow: `0 0 10px ${item.color}80`,
          }}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0,
            scale: 0,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 20 + Math.random() * 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: index * 0.2,
          }}
        >
          {item.symbol}

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-sm -z-10"
            style={{
              color: item.color,
            }}
          >
            {item.symbol}
          </motion.div>
        </motion.div>
      ))}

      {/* Animated blockchain nodes with DOM elements instead of SVG */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: 0,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            boxShadow: [
              "0 0 5px rgba(139, 92, 246, 0.3)",
              "0 0 15px rgba(139, 92, 246, 0.5)",
              "0 0 5px rgba(139, 92, 246, 0.3)",
            ],
          }}
          transition={{
            duration: 3 + i,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

