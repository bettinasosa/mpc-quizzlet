"use client"

import { motion } from "framer-motion"

export default function BetaBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="inline-flex items-center justify-center px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-sm"
    >
      Beta
    </motion.div>
  )
}

