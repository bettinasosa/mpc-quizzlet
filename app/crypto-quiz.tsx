"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { QUESTIONS } from "./data"
import type { AnswerData } from "./types"
import { simulateMPCComputation } from "./utils"
import QuizCard from "./components/quiz-card"
import HolographicBackground from "./components/holographic-background"
import FloatingCryptoSymbols from "./components/floating-crypto-symbols"

export default function CryptoQuiz() {
  const [stage, setStage] = useState<
    "welcome" | "questions" | "loading" | "results"
  >("welcome")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerData>({})
  const [personalityResult, setPersonalityResult] = useState<string>("")
  const isMounted = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleStart = () => {
    setStage("questions")
    // Scroll to top when starting the quiz
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answerIndex }
    setAnswers(newAnswers)

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setStage("loading")
      simulateMPCComputation(newAnswers).then(result => {
        if (isMounted.current) {
          setPersonalityResult(result)
          setStage("results")
        }
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setStage("welcome")
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-auto bg-black"
      style={{
        height: stage === "welcome" ? "auto" : "100vh",
        overflowY: stage === "welcome" ? "auto" : "hidden"
      }}
    >
      <HolographicBackground />
      <FloatingCryptoSymbols />
      <div
        className={`relative z-10 ${stage === "welcome" ? "" : "min-h-screen flex items-center justify-center p-4"}`}
      >
        <AnimatePresence mode="wait">
          <QuizCard
            key={stage}
            stage={stage}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={QUESTIONS.length}
            question={QUESTIONS[currentQuestionIndex]}
            personalityResult={personalityResult}
            onStart={handleStart}
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            onRestart={handleRestart}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
