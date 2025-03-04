import React from "react"
import { motion, useSpring } from "framer-motion"

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total = 10 }: ProgressBarProps) {
  const progress = (current / total) * 100
  const springProgress = useSpring(progress, { stiffness: 100, damping: 30 })

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
      <motion.div
        className="bg-blue-500 h-2 rounded-full"
        style={{ width: springProgress }}
      >
        <span className="sr-only">{`${Math.round(progress)}% Complete`}</span>
      </motion.div>
    </div>
  )
}
