"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import QuizHeader from "@/components/quiz-header"
import QuizCard from "@/components/quiz-card"
import ResultsView from "@/components/results-view"
import LoadingView from "@/components/loading-view"
import { QUESTIONS } from "@/lib/questions"
import { personalityData, type PersonalityType } from "@/lib/personality-data"
import { usePersonalityContract } from "@/hooks/usePersonalityContract"

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  )
  const [showResults, setShowResults] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Use the personality contract hook
  const { submitAnswers, isLoading, error, result, txHash } =
    usePersonalityContract()

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setIsTransitioning(true)

    // Update answers array with the selected answer index (0-3)
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[questionId] = answerIndex
      return newAnswers
    })

    // Delay to allow for animation
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setIsTransitioning(false)
      } else {
        const answersArray = answers.map((ans, index) =>
          index === questionId ? answerIndex : ans === null ? 0 : ans
        )

        submitAnswers(answersArray).then(res => {
          if (res.success) {
            setShowResults(true)
          }
        })
      }
    }, 500)
  }

  const handleSkip = () => {
    setIsTransitioning(true)

    // If skipping, set the current question's answer to 0 (default)
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestion] = 0
      return newAnswers
    })

    setTimeout(() => {
      setCurrentQuestion(prev => prev + 1)
      setIsTransitioning(false)
    }, 500)
  }

  const resetQuiz = () => {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setCurrentQuestion(0)
    setShowResults(false)
  }

  // Prepare result data for the ResultsView
  const getResultData = () => {
    if (!result) return null

    const personalityType = result as PersonalityType

    // Fallback in case the returned personality is not in our data
    if (!personalityData[personalityType]) {
      return {
        type: personalityType,
        data: {
          description: "Your unique crypto personality has been analyzed.",
          traits: ["Crypto Enthusiast"],
          image: "/placeholder.svg?height=200&width=200"
        },
        txHash: txHash || ""
      }
    }

    return {
      type: personalityType,
      data: personalityData[personalityType],
      txHash: txHash || ""
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col items-center">
      <QuizHeader />

      <div className="w-full max-w-3xl px-4 py-8 flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isLoading && !showResults ? (
            <motion.div
              key="question"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <QuizCard
                question={QUESTIONS[currentQuestion]}
                onAnswer={handleAnswer}
                isTransitioning={isTransitioning}
                progress={(currentQuestion / QUESTIONS.length) * 100}
              />

              <div className="mt-8 flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
                <span>
                  Question {currentQuestion + 1} of {QUESTIONS.length}
                </span>
                {currentQuestion < QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleSkip}
                    className="flex items-center text-black dark:text-white hover:underline"
                    disabled={isTransitioning}
                  >
                    Skip <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                ) : null}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                  {error}
                </div>
              )}
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <LoadingView />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {result && getResultData() && (
                <ResultsView result={getResultData()!} onReset={resetQuiz} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
