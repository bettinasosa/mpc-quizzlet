"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QuizQuestion from "@/components/QuizQuestion"
import ProgressBar from "@/components/ProgressBar"
import Results from "@/components/Results"
import Logo from "@/components/Logo"
import { QUESTIONS } from "@/lib/data/questions"
import { usePersonalityContract } from "@/hooks/usePersonalityContract"

export default function Quiz() {
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Create one instance of the hook at the top level.
  const { submitAnswers, isLoading, error, result, txHash } =
    usePersonalityContract()

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)

    if (questionIndex < Object.keys(QUESTIONS).length - 1) {
      setCurrentQuestionIndex(questionIndex + 1)
    } else {
      // Submit the answers and then show results.
      submitAnswers(newAnswers)
      setShowResults(true)
    }
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)"
    ]
  )

  useEffect(() => {
    if (containerRef.current) {
      const targetQuestion = containerRef.current.querySelector(
        `#question-${currentQuestionIndex}`
      )
      if (targetQuestion) {
        targetQuestion.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentQuestionIndex])

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background }}
    >
      <Card className="w-full max-w-4xl shadow-lg overflow-hidden">
        <CardHeader className="bg-white p-8 border-b sticky top-0 z-10">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Logo />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-center text-gray-800 mb-4">
            The Crypto Personality Quiz
          </CardTitle>
          <p className="text-center text-gray-600 font-medium text-lg mb-6">
            Discover Your Inner Crypto Persona
          </p>
          {currentQuestionIndex === -1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6"
            >
              <p className="font-bold">Privacy Notice:</p>
              <p>
                This quiz uses advanced Multi-Party Computation (MPC) to ensure
                your answers remain private. Your data is processed securely
                without exposing individual responses.
              </p>
            </motion.div>
          )}
          {currentQuestionIndex >= 0 && !showResults && (
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={Object.keys(QUESTIONS).length}
            />
          )}
        </CardHeader>
        <CardContent
          className="bg-white p-8 overflow-y-auto max-h-[70vh]"
          ref={containerRef}
        >
          {currentQuestionIndex === -1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xl mb-6">
                Ready to discover your crypto personality while keeping your
                data private?
              </p>
              <Button
                onClick={() => setCurrentQuestionIndex(0)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Start Quiz
              </Button>
            </motion.div>
          ) : !showResults ? (
            Object.entries(QUESTIONS).map(([index, question], i) => (
              <motion.div
                key={index}
                id={`question-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="mb-12 last:mb-0"
              >
                <QuizQuestion
                  question={question}
                  questionIndex={Number.parseInt(index)}
                  selectedAnswer={answers[Number.parseInt(index)]}
                  onAnswer={handleAnswer}
                  isCurrent={Number.parseInt(index) === currentQuestionIndex}
                />
              </motion.div>
            ))
          ) : (
            // Pass the hook state down to the Results component.
            <Results
              isLoading={isLoading}
              result={result}
              txHash={txHash}
              error={error}
            />
          )}
        </CardContent>
        {currentQuestionIndex >= 0 && !showResults && (
          <motion.div
            className="sticky bottom-0 bg-white p-8 border-t flex justify-between items-center"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Button
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentQuestionIndex(
                  Math.min(
                    Object.keys(QUESTIONS).length - 1,
                    currentQuestionIndex + 1
                  )
                )
              }
              disabled={
                currentQuestionIndex === Object.keys(QUESTIONS).length - 1
              }
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
