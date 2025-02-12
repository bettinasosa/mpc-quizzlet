"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { usePersonalityContract } from "@/hooks/usePersonalityContract"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ResultsProps {
  answers: number[]
}

export default function Results({ answers }: ResultsProps) {
  const { submitAnswers, isLoading, error, result } = usePersonalityContract()

  useEffect(() => {
    submitAnswers(answers)
  }, [answers])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="mt-4 text-gray-600">
          Computing your crypto personality securely...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => submitAnswers(answers)}>Try Again</Button>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8"
    >
      <h2 className="text-2xl font-bold mb-4">Your Crypto Personality:</h2>
      <p className="text-xl text-purple-600 mb-6">{result}</p>

      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-2">How This Works:</h3>
        <p className="text-gray-600">
          Your answers were processed using Multi party computation on the
          Partisia blockchain, ensuring your privacy while determining your
          crypto personality type.
        </p>
      </div>
    </motion.div>
  )
}
