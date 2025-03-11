"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

type FeatureCardProps = {
  title: string
  description: string
  icon: ReactNode
  delay: number
  isInView: boolean
}

export default function FeatureCard({ title, description, icon, delay, isInView }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-8 shadow-lg"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: 0.2 + delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-12 h-12 rounded-full bg-[#007aff] dark:bg-[#5ac8fa] text-white flex items-center justify-center mb-4"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 },
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  )
}

