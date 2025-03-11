"use client"

import { motion } from "framer-motion"
import { Lock } from "lucide-react"

type PrivacyNoticeProps = {
  isInView: boolean
}

export default function PrivacyNotice({ isInView }: PrivacyNoticeProps) {
  return (
    <motion.div
      className="rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] p-8 shadow-lg border border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="w-12 h-12 rounded-full bg-[#007aff] dark:bg-[#5ac8fa] text-white flex items-center justify-center"
          animate={
            isInView
              ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }
              : {}
          }
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Lock className="h-6 w-6" />
        </motion.div>
        <h3 className="text-2xl font-bold">Privacy Notice</h3>
      </div>

      <motion.p
        className="text-gray-600 dark:text-gray-400 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        This quiz uses advanced Multi-Party Computation (MPC) to ensure your answers remain private. Your data is
        processed securely without exposing individual responses.
      </motion.p>

      <motion.div
        className="text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <p>Your privacy is our priority. All computations happen on-chain using secure MPC protocols.</p>
      </motion.div>
    </motion.div>
  )
}

