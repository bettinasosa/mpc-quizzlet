"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { QUESTIONS } from "../lib/data/data"
import type { AnswerData } from "./types"
import QuizCard from "./components/QuizCard"
import HolographicBackground from "./components/HolographicBackground"
import FloatingCryptoSymbols from "./components/FloatingCryptoSymbols"
import { usePersonalityContract } from "@/hooks/usePersonalityContract"

export default function CryptoQuiz() {
  const [stage, setStage] = useState<
    "welcome" | "questions" | "loading" | "results"
  >("welcome")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerData>([])
  const [personalityResult, setPersonalityResult] = useState<string>("")
  const isMounted = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { submitAnswers, result } = usePersonalityContract()

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleStart = () => {
    setStage("questions")
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleAnswer = async (answerIndex: number) => {
    // Compute the new answers array
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setStage("loading")
      const res = await submitAnswers(newAnswers)
      if (res.success) {
        setPersonalityResult(res.personality)
        setStage("results")
      } else {
        console.error("Failed to submit answers")
      }
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
