"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Question } from "../types"
import CyberButton from "./CyberButton"

interface QuestionScreenProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  onAnswer: (answerIndex: number) => void
  onPrevious: () => void
}

export default function QuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onPrevious
}: QuestionScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null)
  }, [question.text])

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitting(true)
      setTimeout(() => {
        onAnswer(selectedAnswer)
        setSelectedAnswer(null)
        setIsSubmitting(false)
      }, 500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      {/* Progress bar */}
      <div className="relative">
        <div className="flex justify-between text-sm text-purple-300/70 mb-2">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>
            {Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 bg-purple-900/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            animate={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="relative p-6 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm" />
        <h2 className="relative text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <motion.span
            className="text-3xl"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop"
            }}
          >
            {question.icon}
          </motion.span>
          {question.text}
        </h2>
      </div>

      {/* Answers */}
      <div className="grid gap-4">
        <AnimatePresence>
          {question.answers.map((answer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedAnswer(index)}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className={`
                relative p-4 rounded-xl cursor-pointer overflow-hidden
                transition-all duration-300 transform-gpu
                ${selectedAnswer === index ? "scale-[1.02]" : "hover:scale-[1.01]"}
              `}
            >
              {/* Background with 3D effect */}
              <motion.div
                className={`
                  absolute inset-0 transition-all duration-300
                  ${
                    selectedAnswer === index
                      ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20"
                      : "bg-gradient-to-r from-purple-900/10 to-blue-900/10"
                  }
                `}
                animate={{
                  rotateX: hoverIndex === index ? 5 : 0,
                  rotateY: hoverIndex === index ? 5 : 0
                }}
              />

              {/* Border */}
              <div
                className={`
                  absolute inset-0 border rounded-xl transition-all duration-300
                  ${selectedAnswer === index ? "border-purple-500/50" : "border-white/10"}
                `}
              />

              {/* Content */}
              <div className="relative flex items-center gap-4">
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300
                    ${selectedAnswer === index ? "border-purple-500 bg-purple-500/20" : "border-white/30"}
                  `}
                >
                  {selectedAnswer === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                    />
                  )}
                </div>
                <span className="text-lg text-white">{answer}</span>
              </div>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ opacity: 0.1 }}
              />

              {/* Scan line effect on hover */}
              {hoverIndex === index && (
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute w-full h-[1px] bg-purple-400/30"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <CyberButton
          onClick={onPrevious}
          disabled={currentIndex === 0}
          variant="secondary"
        >
          Previous
        </CyberButton>

        <CyberButton
          onClick={handleSubmit}
          disabled={selectedAnswer === null || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear"
                }}
              />
              Processing...
            </div>
          ) : (
            "Next"
          )}
        </CyberButton>
      </div>
    </motion.div>
  )
}
