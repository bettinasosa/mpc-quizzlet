"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

type FloatingIcon = {
  icon: string
  x: number
  y: number
  size: string
  delay: number
  duration: number
}

export default function FloatingIcons() {
  const [icons, setIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    // Generate random icons
    const cryptoIcons = ["₿", "Ξ", "◎", "Ð", "₳", "Ł", "Ƀ", "💼", "💰", "📊", "🖼️", "🕵️", "🚀", "📈", "👥", "⚙️", "📉"]
    const newIcons: FloatingIcon[] = []

    for (let i = 0; i < 15; i++) {
      newIcons.push({
        icon: cryptoIcons[Math.floor(Math.random() * cryptoIcons.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: `text-${Math.floor(Math.random() * 3) + 2}xl`,
        delay: Math.random() * 2,
        duration: Math.random() * 10 + 10,
      })
    }

    setIcons(newIcons)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.size} text-gray-200 dark:text-gray-800 opacity-30`}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.3,
            scale: 1,
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            delay: item.delay,
            duration: item.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  )
}

