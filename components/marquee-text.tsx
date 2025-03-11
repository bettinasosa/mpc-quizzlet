"use client"

import { motion } from "framer-motion"
import { useRef } from "react"

type MarqueeTextProps = {
  items: string[]
  speed?: number
  className?: string
}

export default function MarqueeText({ items, speed = 50, className = "" }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-block"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: items.length * (100 / speed),
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {items.map((item, index) => (
          <span key={index} className="inline-block mx-8 text-[clamp(2rem,8vw,6rem)] font-bold opacity-20">
            {item}
          </span>
        ))}
        {items.map((item, index) => (
          <span key={`repeat-${index}`} className="inline-block mx-8 text-[clamp(2rem,8vw,6rem)] font-bold opacity-20">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

