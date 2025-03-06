"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { Question } from "../types"
import WelcomeScreen from "./welcome-screen"
import QuestionScreen from "./question-screen"
import LoadingScreen from "./loading-screen"
import ResultsScreen from "./results-screen"

interface QuizCardProps {
  stage: "welcome" | "questions" | "loading" | "results"
  currentQuestionIndex: number
  totalQuestions: number
  question: Question
  personalityResult: string
  onStart: () => void
  onAnswer: (answerIndex: number) => void
  onPrevious: () => void
  onRestart: () => void
}

export default function QuizCard({
  stage,
  currentQuestionIndex,
  totalQuestions,
  question,
  personalityResult,
  onStart,
  onAnswer,
  onPrevious,
  onRestart
}: QuizCardProps) {
  // For welcome screen, render it directly without the card wrapper
  if (stage === "welcome") {
    return <WelcomeScreen onStart={onStart} />
  }

  // For other stages, use the card wrapper
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-4xl perspective"
    >
      <div className="relative transform-3d">
        {/* Glassmorphism card effect with holographic sheen */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur-xl rounded-3xl border border-white/10 holographic-card" />

        {/* Animated neon border */}
        <div className="absolute inset-0 rounded-3xl neon-border" />

        <div className="relative backdrop-blur-3xl rounded-3xl p-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 mb-2"
            >
              MPC Crypto Personalities
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-200/80"
            >
              Discover Your Inner Crypto Persona
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {stage === "questions" && (
              <QuestionScreen
                key={`question-${currentQuestionIndex}`}
                question={question}
                currentIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                onAnswer={onAnswer}
                onPrevious={onPrevious}
              />
            )}

            {stage === "loading" && (
              <LoadingScreen
                key="loading"
                onComplete={() => {
                  if (personalityResult) {
                    // This will transition to the results screen
                    setTimeout(() => {
                      // Small delay to ensure smooth transition
                      onRestart() // This will reset to welcome screen if there's an issue
                    }, 80)
                  }
                }}
              />
            )}

            {stage === "results" && personalityResult && (
              <ResultsScreen
                key="results"
                personalityType={personalityResult}
                onRestart={onRestart}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
