"use client"

import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import BetaBadge from "./beta-badge"

export default function QuizHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)

    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <motion.header
      className="w-full bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h1 className="text-xl font-bold text-black dark:text-white">AI CRYPTO IDENTITY</h1>
            <BetaBadge />
          </motion.div>
        </Link>

        <motion.button
          className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white"
          onClick={toggleDarkMode}
          whileTap={{ scale: 0.9 }}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.button>
      </div>
    </motion.header>
  )
}

