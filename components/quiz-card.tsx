"use client"

import { motion } from "framer-motion"
import type { Question } from "@/lib/questions"

type QuizCardProps = {
  question: Question
  onAnswer: (questionId: number, answerIndex: number) => void
  isTransitioning: boolean
  progress: number
}

export default function QuizCard({ question, onAnswer, isTransitioning, progress }: QuizCardProps) {
  return (
    <motion.div
      className="w-full border-2 border-black dark:border-white p-8"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 mb-8">
        <motion.div
          className="h-full bg-black dark:bg-white"
          initial={{ width: `${progress - 10}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.span
            className="text-3xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {question.icon}
          </motion.span>
          <motion.h2
            className="text-2xl font-bold text-black dark:text-white"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {question.text}
          </motion.h2>
        </div>
      </div>

      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <motion.button
            key={index}
            onClick={() => !isTransitioning && onAnswer(question.question_id, index)}
            className="w-full text-left p-4 border-2 border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-black dark:text-white transition-colors"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{
              scale: 1.02,
              borderColor: "#000",
            }}
            whileTap={{ scale: 0.98 }}
            disabled={isTransitioning}
          >
            {answer}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="mt-8 p-4 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>
          <strong>AI-POWERED:</strong> Your answers are being analyzed by our secure AI model on Partisia Blockchain
          while remaining fully encrypted.
        </p>
      </motion.div>
    </motion.div>
  )
}

