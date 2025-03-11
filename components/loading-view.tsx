"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Lock, Sparkles } from "lucide-react"

export default function LoadingView() {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState(
    "Initializing blockchain computation..."
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    // Update status text based on progress
    const textInterval = setInterval(() => {
      if (progress < 25) {
        setStatusText("Initializing blockchain computation...")
      } else if (progress < 50) {
        setStatusText("Encrypting your answers with MPC...")
      } else if (progress < 75) {
        setStatusText("Processing on Partisia Blockchain...")
      } else {
        setStatusText("Finalizing your results...")
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [progress])

  return (
    <div className="w-full border-2 border-black dark:border-white p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-8">
          <motion.div
            className="w-16 h-16 border-2 border-black dark:border-white rounded-full flex items-center justify-center mr-4"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
          >
            <Sparkles className="h-6 w-6 text-black dark:text-white" />
          </motion.div>
          <motion.div
            className="w-16 h-16 border-2 border-black dark:border-white rounded-full flex items-center justify-center"
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
          >
            <Lock className="h-6 w-6 text-black dark:text-white" />
          </motion.div>
        </div>

        <motion.h2
          className="text-2xl font-bold text-black dark:text-white mb-6"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {statusText}
        </motion.h2>

        <div className="w-full max-w-md bg-neutral-200 dark:bg-neutral-800 h-2 mb-4">
          <motion.div
            className="h-full bg-black dark:bg-white"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Your data is being processed securely using AI and Partisia's
          Multi-Party Computation
        </p>

        <div className="mt-8 p-4 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
          <p>
            <strong>BLOCKCHAIN VERIFICATION:</strong> Your answers are fully
            encrypted and processed securely on the Partisia blockchain. You'll
            receive a transaction hash as proof of computation.
          </p>
        </div>
      </div>
    </div>
  )
}
